"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";
import { familyMembers, FamilyMessage } from "@/app/lib/mockData";

const FAMILY_ID = "family_1";

export default function MessagesPage() {
  const user = useSupabaseUser();
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting");

  const displayName = useMemo(() => {
    return user?.user_metadata?.display_name as string | undefined;
  }, [user?.user_metadata?.display_name]);

  const activeMemberId = useMemo(() => {
    if (!user?.id) return "family";
    return familyMembers.find(m => m.id.toLowerCase() === user.id.toLowerCase())?.id ?? "family";
  }, [user?.id]);
  
  const canEdit = Boolean(user);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("family_id", FAMILY_ID)
        .order("created_at", { ascending: false });

      if (data) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          authorId: m.author_id,
          text: m.text,
          timestamp: m.created_at,
        })));
      }
      setLoading(false);
    };

    fetchMessages();

    // REAL-TIME SUBSCRIPTION WITH DEBUGGING
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `family_id=eq.${FAMILY_ID}`,
        },
        (payload) => {
          console.log("New message received via Realtime:", payload);
          const newMessage: FamilyMessage = {
            id: payload.new.id,
            authorId: payload.new.author_id,
            text: payload.new.text,
            timestamp: payload.new.created_at,
          };
          setMessages((prev) => [newMessage, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        if (status === "SUBSCRIBED") setStatus("connected");
        if (status === "CHANNEL_ERROR") setStatus("error");
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handlePost = async () => {
    if (!canEdit || !draft.trim()) return;
    const { error } = await supabase.from("messages").insert({
      author_id: activeMemberId,
      text: draft.trim(),
      family_id: FAMILY_ID,
    });
    if (!error) setDraft("");
  };

  return (
    <ShellFrame>
      <div className="space-y-4 accent-sky">
        <PageHeader
          title="Messages"
          subtitle="Quick updates for the whole family."
          accent="sky"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          }
          right={
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{status}</span>
            </div>
          }
        />

        <Card>
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl bg-zinc-50 px-4 py-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share an update..."
                className="min-h-[120px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Posting as <b>{displayName || activeMemberId}</b></span>
                <button onClick={handlePost} className="btnAccent rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]" disabled={!canEdit}>
                  Post
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? <div className="text-center py-10 text-sm text-zinc-400">Syncing messages...</div> : messages.map((m) => (
                <div key={m.id} className="rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Avatar memberId={m.authorId} size={28} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-600 uppercase">{m.authorId}</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="mt-2 text-sm text-zinc-600">{m.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
