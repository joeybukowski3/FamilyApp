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

const FAMILY_ID = "family_1";

export default function ListDetailPage() {
  const user = useSupabaseUser();
  const [items, setItems] = useState<any[]>([]);
  const [listTitle, setListTitle] = useState("");
  const [draft, setDraft] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const routeParams = useParams();
  const listId = routeParams?.listId as string;

  useEffect(() => {
    if (!listId) return;

    const fetchListItems = async () => {
      setLoading(true);
      // Fetch list details and items from Supabase
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("list_id", listId)
        .eq("family_id", FAMILY_ID)
        .order("created_at", { ascending: false });

      if (data) {
        setItems(data);
        // Using common list names as a fallback for title
        const titles: Record<string, string> = {
          todo: "To-Do List",
          wishlist: "Wish List",
          christmas: "Christmas List",
          custom: "Custom List"
        };
        setListTitle(titles[listId] || "Family List");
      }
      setLoading(false);
    };

    fetchListItems();

    // REAL-TIME: Listen for all changes to items in this specific list
    const channel = supabase.channel(`list-${listId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "todos",
        filter: `list_id=eq.${listId}`
      }, (payload) => {
        if (payload.eventType === "INSERT") {
          setItems(prev => [payload.new, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setItems(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
        } else if (payload.eventType === "DELETE") {
          setItems(prev => prev.filter(i => i.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [listId]);

  const activeMemberId = useMemo(() => {
    if (!user?.id) return "family";
    return familyMembers.find(m => m.id.toLowerCase() === user.id.toLowerCase())?.id ?? "family";
  }, [user?.id]);

  const handleAddItem = async () => {
    if (!user || !draft.trim()) return;
    
    const { error } = await supabase.from("todos").insert({
      task: draft.trim(),
      author_id: activeMemberId,
      family_id: FAMILY_ID,
      list_id: listId,
      is_completed: false
    });

    if (!error) setDraft("");
  };

  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    if (!user) return;
    await supabase
      .from("todos")
      .update({ is_completed: !currentStatus, completed_at: !currentStatus ? new Date().toISOString() : null })
      .eq("id", itemId);
  };

  const visibleItems = hideCompleted ? items.filter(i => !i.is_completed) : items;

  return (
    <ShellFrame>
      <div className="accent-mint">
        <Card title={listTitle}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
              <input
                type="text"
                placeholder="Add item..."
                className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600 sm:w-56"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="btnAccent rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <span>{items.length} item{items.length === 1 ? "" : "s"}</span>
            <button
              onClick={() => setHideCompleted(!hideCompleted)}
              className="rounded-full border border-zinc-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              {hideCompleted ? "Show completed" : "Hide completed"}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? <div className="py-10 text-center text-xs animate-pulse">Loading list...</div> : visibleItems.map((item) => (
              <label key={item.id} className="flex items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  checked={item.is_completed}
                  onChange={() => handleToggleComplete(item.id, item.is_completed)}
                />
                <Avatar memberId={item.author_id} size={28} />
                <div className="flex-1">
                  <div className={`font-medium ${item.is_completed ? "line-through text-zinc-400" : ""}`}>{item.task}</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {item.author_id} • {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
