"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";
import { familyMembers, FamilyMessage } from "@/app/lib/mockData";

const FAMILY_ID = "family_hive_main";

export default function MessagesPage() {
  const user = useSupabaseUser();
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("connecting");

  const activeMemberId = useMemo(() => {
    if (!user?.id) return "family";
    return familyMembers.find(m => m.id.toLowerCase() === user.id.toLowerCase())?.id ?? "family";
  }, [user?.id]);
  
  const fetchMessages = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("family_id", FAMILY_ID)
      .order("created_at", { ascending: false });

    if (data) {
      setMessages(data.map((m: any) => ({
        id: m.id, authorId: m.author_id, text: m.text, timestamp: m.created_at,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();

    // 1. Try Realtime
    const channel = supabase.channel('family_chat')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
      fetchMessages(true);
    })
    .subscribe((newStatus) => {
      setStatus(newStatus);
    });

    // 2. Safety Refresh (Every 15 seconds) in case Realtime times out
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 15000);

    return () => { 
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [activeMemberId]);

  const handlePost = async () => {
    const text = draft.trim();
    if (!text) return;
    
    const { error } = await supabase.from("messages").insert({
      author_id: activeMemberId,
      text: text,
      family_id: FAMILY_ID,
    });

    if (!error) {
      setDraft("");
      fetchMessages(true);
    }
  };

  return (
    <ShellFrame>
      <div className="space-y-4 accent-sky">
        <PageHeader
          title="Family Board"
          subtitle="Updates and messages."
          accent="sky"
          right={
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status === 'SUBSCRIBED' ? 'bg-green-500' : 'bg-zinc-300'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {status === 'SUBSCRIBED' ? 'Live' : 'Auto-Sync'}
              </span>
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
                className="min-h-[80px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Posting as <span className="uppercase font-bold">{activeMemberId}</span></span>
                <button onClick={handlePost} className="btnAccent rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest">
                  Post
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-10 text-xs text-zinc-400">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-400 border-2 border-dashed border-zinc-100 rounded-2xl">
                  Board is empty.
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="rounded-2xl bg-zinc-50 px-4 py-3 border border-zinc-100 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Avatar memberId={m.authorId} size={28} />
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-zinc-400">
                          <span className="font-bold text-zinc-600 uppercase">{m.authorId}</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="mt-1 text-sm text-zinc-600 leading-relaxed">{m.text}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
