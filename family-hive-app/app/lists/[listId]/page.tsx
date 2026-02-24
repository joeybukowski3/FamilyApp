"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";
import { familyMembers } from "@/app/lib/mockData";
import {
  getSeedLists,
  hydrateLists,
  ListsState,
  saveLists,
} from "@/app/lib/listsStore";

export default function ListDetailPage() {
  const user = useSupabaseUser();
  const router = useRouter();
  const [lists, setLists] = useState<ListsState>(getSeedLists);
  const [draft, setDraft] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const routeParams = useParams();
  const listIdRaw = routeParams?.listId;
  const listId = Array.isArray(listIdRaw)
    ? listIdRaw[0]
    : (listIdRaw as string | undefined);

  // 1. Protection Gatekeeper: Check for User and PIN
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser();
      
      if (!activeUser) {
        router.push("/unlock");
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('pin_hash')
        .eq('id', activeUser.id)
        .single();

      if (!profile?.pin_hash) {
        router.push("/unlock");
      } else {
        setIsAuthorized(true);
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    setLists(hydrateLists());
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const displayName = useMemo(() => {
    return (
      (user?.user_metadata?.display_name as string | undefined) ?? user?.email
    );
  }, [user?.email, user?.user_metadata?.display_name]);

  const activeMemberId = useMemo(() => {
    if (!user?.email) {
      return familyMembers[0]?.id ?? "family";
    }
    const local = user.email.split("@")[0]?.toLowerCase() ?? "";
    return (
      familyMembers.find(
        (member) =>
          member.id.toLowerCase() === local ||
          member.name.toLowerCase() === local
      )?.id ??
      familyMembers[0]?.id ??
      "family"
    );
  }, [user?.email]);

  const canEdit = Boolean(user) && isAuthorized;

  // Render nothing while checking authorization to prevent flickering
  if (!isAuthorized) return null;

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
              const creatorLabel =
                item.createdByMemberId === activeMemberId && displayName
                  ? displayName
                  : creator?.name ?? "Family";
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
                  <Avatar memberId={item.createdByMemberId} size={28} />
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        item.completedAt ? "line-through text-zinc-400" : ""
                      }`}
                    >
                      {item.text}
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">
                      {creatorLabel} •{" "}
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
