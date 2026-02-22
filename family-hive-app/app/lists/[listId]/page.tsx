"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { familyMembers } from "@/app/lib/mockData";
import {
  getSeedLists,
  hydrateLists,
  ListsState,
  saveLists,
} from "@/app/lib/listsStore";

export default function ListDetailPage() {
  const [lists, setLists] = useState<ListsState>(getSeedLists);
  const [draft, setDraft] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const routeParams = useParams();
  const listIdRaw = routeParams?.listId;
  const listId = Array.isArray(listIdRaw)
    ? listIdRaw[0]
    : (listIdRaw as string | undefined);

  useEffect(() => {
    setLists(hydrateLists());

    if (typeof window === "undefined") return;
    const storedSession = window.localStorage.getItem("family-hive-session");
    if (!storedSession) return;

    try {
      const parsed = JSON.parse(storedSession) as {
        memberId?: string;
        unlocked?: boolean;
      };
      if (parsed.unlocked && parsed.memberId) {
        setActiveMemberId(parsed.memberId);
      }
    } catch {
      window.localStorage.removeItem("family-hive-session");
    }
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const canEdit = Boolean(activeMemberId);

  // Guard: route param missing
  if (!listId || typeof listId !== "string") {
    return (
      <ShellFrame>
        <Card title="List">
          <div className="text-sm text-zinc-500">
            Missing list id.{" "}
            <Link href="/lists" className="font-semibold text-zinc-700">
              Back to lists
            </Link>
          </div>
        </Card>
      </ShellFrame>
    );
  }

  const group = lists.groups.find((entry) => entry.id === listId);

  if (!group) {
    return (
      <ShellFrame>
        <Card title="List not found">
          <div className="text-sm text-zinc-500">
            This list does not exist.{" "}
            <Link href="/lists" className="font-semibold text-zinc-700">
              Back to lists
            </Link>
          </div>
        </Card>
      </ShellFrame>
    );
  }

  const listItems = lists.items.filter((item) => item.listId === group.id);
  const incompleteItems = listItems.filter((item) => !item.completedAt);
  const completedItems = listItems.filter((item) => item.completedAt);
  const visibleItems = hideCompleted
    ? incompleteItems
    : [...incompleteItems, ...completedItems];

  const handleAddItem = () => {
    if (!canEdit || !activeMemberId) return;
    const trimmed = draft.trim();
    if (!trimmed) return;

    const nextItem = {
      id: `item-${Date.now()}`,
      listId: group.id,
      text: trimmed,
      createdAt: new Date().toISOString(),
      createdByMemberId: activeMemberId,
      completedAt: undefined as string | undefined,
    };

    setLists((prev) => {
      const updated = { ...prev, items: [nextItem, ...prev.items] };
      saveLists(updated);
      return updated;
    });

    setDraft("");
  };

  const handleToggleComplete = (itemId: string) => {
    if (!canEdit) return;

    setLists((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          completedAt: item.completedAt ? undefined : new Date().toISOString(),
        };
      });
      const updated = { ...prev, items: updatedItems };
      saveLists(updated);
      return updated;
    });
  };

  return (
    <ShellFrame>
      <div className="accent-mint">
        <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-700">
              {group.title}
            </div>
            <p className="text-xs text-zinc-400">
              {listItems.length} item{listItems.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
            <input
              type="text"
              placeholder="Add item..."
              className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600 sm:w-56"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={!canEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddItem();
              }}
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="btnAccent rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              disabled={!canEdit}
            >
              Add Item
            </button>
          </div>
        </div>

        {!canEdit ? (
          <div className="mt-3 rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
            Unlock to add or complete items.{" "}
            <Link href="/unlock" className="font-semibold text-zinc-700">
              Go to unlock
            </Link>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <span>
            {listItems.length} item{listItems.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => setHideCompleted((prev) => !prev)}
            className="rounded-full border border-zinc-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500"
          >
            {hideCompleted ? "Show completed" : "Hide completed"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {visibleItems.map((item) => {
            const creator = memberLookup.get(item.createdByMemberId);
            return (
              <label
                key={item.id}
                className="flex items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600"
              >
                <input
                  type="checkbox"
                  checked={Boolean(item.completedAt)}
                  onChange={() => handleToggleComplete(item.id)}
                  disabled={!canEdit}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      item.completedAt ? "line-through text-zinc-400" : ""
                    }`}
                  >
                    {item.text}
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {creator?.name ?? "Family"} ·{" "}
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        </Card>
      </div>
    </ShellFrame>
  );
}

