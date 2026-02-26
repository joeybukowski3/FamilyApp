"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { supabase } from "@/app/lib/supabaseClient";

const FAMILY_ID = "family_1";

export default function DashboardPage() {
  const [todos, setTodos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch latest 3 items for each section
      const [todoRes, msgRes, eventRes, photoRes] = await Promise.all([
        supabase.from("todos").select("*").eq("family_id", FAMILY_ID).order("created_at", { ascending: false }).limit(3),
        supabase.from("messages").select("*").eq("family_id", FAMILY_ID).order("created_at", { ascending: false }).limit(3),
        supabase.from("schedule").select("*").eq("family_id", FAMILY_ID).order("start_iso", { ascending: true }).limit(3),
        supabase.from("photos").select("*").eq("family_id", FAMILY_ID).order("created_at", { ascending: false }).limit(6)
      ]);

      if (todoRes.data) setTodos(todoRes.data);
      if (msgRes.data) setMessages(msgRes.data);
      if (eventRes.data) setEvents(eventRes.data);
      if (photoRes.data) setPhotos(photoRes.data);
      
      setLoading(false);
    };

    fetchDashboardData();

    // Subscribe to changes to keep dashboard fresh
    const channel = supabase.channel("dashboard-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => fetchDashboardData())
      .on("postgres_changes", { event: "*", schema: "public", table: "photos" }, () => fetchDashboardData())
      .on("postgres_changes", { event: "*", schema: "public", table: "todos" }, () => fetchDashboardData())
      .on("postgres_changes", { event: "*", schema: "public", table: "schedule" }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <ShellFrame>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div className="space-y-4 lg:space-y-6">
          <Card title="To-Do">
            <div className="space-y-3">
              {loading ? <div className="animate-pulse h-20 bg-zinc-50 rounded-2xl" /> : todos.length === 0 ? (
                <div className="text-xs text-zinc-400 py-4 text-center">No active tasks.</div>
              ) : todos.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="min-w-0 flex-1 truncate text-sm text-zinc-600">{item.task}</div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-500 shadow uppercase">
                    {item.author_id?.slice(0,1)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Shared Photo Roll">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {loading ? [1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-zinc-100 animate-pulse" />) : photos.map((p) => (
                <div key={p.id} className="h-20 w-full rounded-2xl bg-zinc-100 overflow-hidden">
                  <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Card title="Family Message Board">
            <div className="space-y-3">
              {loading ? <div className="animate-pulse h-20 bg-zinc-50 rounded-2xl" /> : messages.length === 0 ? (
                <div className="text-xs text-zinc-400 py-4 text-center">No messages yet.</div>
              ) : messages.map((message) => (
                <div key={message.id} className="rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span className="min-w-0 truncate font-semibold text-zinc-600 uppercase">{message.author_id}</span>
                    <span className="shrink-0">{new Date(message.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600 line-clamp-2">{message.text}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Family Schedule">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] text-zinc-400">
              {"SMTWTFS".split("").map((day, i) => <div key={i}>{day}</div>)}
            </div>
            <div className="mt-4 space-y-2">
              {loading ? <div className="animate-pulse h-10 bg-zinc-50 rounded-2xl" /> : events.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                  <span className="min-w-0 truncate">{event.title}</span>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {new Date(event.start_iso).toLocaleDateString(undefined, {weekday: 'short'})}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ShellFrame>
  );
}
