"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import { supabase } from "@/app/lib/supabaseClient";

const FAMILY_ID = "00000000-0000-0000-0000-000000000001";

export default function ListsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [previews, setPreviews] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const listGroups = [
    { id: "todo", title: "To-Do List" },
    { id: "wishlist", title: "Wish List" },
    { id: "christmas", title: "Christmas List" },
    { id: "custom", title: "Custom" },
  ];

  useEffect(() => {
    const fetchListsOverview = async () => {
      setLoading(true);
      // Fetch items for all lists to get counts and previews
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("family_id", FAMILY_ID);

      if (data) {
        const newCounts: Record<string, number> = {};
        const newPreviews: Record<string, any[]> = {};

        data.forEach(item => {
          const listId = item.list_id || "todo";
          newCounts[listId] = (newCounts[listId] || 0) + 1;
          if (!newPreviews[listId]) newPreviews[listId] = [];
          if (newPreviews[listId].length < 3 && !item.is_completed) {
            newPreviews[listId].push(item);
          }
        });

        setCounts(newCounts);
        setPreviews(newPreviews);
      }
      setLoading(false);
    };

    fetchListsOverview();
  }, []);

  return (
    <ShellFrame>
      <div className="space-y-4 accent-mint">
        <PageHeader
          title="Lists"
          subtitle="Family tasks, wish lists, and custom collections."
          accent="mint"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {listGroups.map((group) => {
            const listItems = previews[group.id] || [];
            const itemCount = counts[group.id] || 0;
            return (
              <Card key={group.id} title={group.title}>
                <Link
                  href={`/lists/${group.id}`}
                  className="block rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition hover:bg-zinc-100"
                >
                  <div className="space-y-2">
                    {loading ? (
                      <div className="animate-pulse h-4 bg-zinc-200 rounded w-3/4" />
                    ) : listItems.length === 0 ? (
                      <div className="text-xs text-zinc-400">
                        No active items.
                      </div>
                    ) : (
                      listItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-zinc-300" />
                          <span className="truncate">{item.task}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-3 text-xs text-zinc-400">
                    {itemCount} item{itemCount === 1 ? "" : "s"}
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </ShellFrame>
  );
}
