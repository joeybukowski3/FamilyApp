"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";
import { familyMembers, FamilyMessage } from "@/app/lib/mockData";

const FAMILY_ID = "family_hive_main"; // Simplified ID
const APP_VERSION = "1.0.6"; 

export default function MessagesPage() {
  const user = useSupabaseUser();
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("initializing...");
  const [debug, setDebug] = useState<string>("");

  const activeMemberId = useMemo(() => {
    if (!user?.id) return "family";
    return familyMembers.find(m => m.id.toLowerCase() === user.id.toLowerCase())?.id ?? "family";
  }, [user?.id]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("family_id", FAMILY_ID)
        .order("created_at", { ascending: false });

      if (error) {
        setDebug(`FetchErr: ${error.message}`);
      } else if (data) {
        setMessages(data.map((m: any) => ({
          id: m.id, authorId: m.author_id, text: m.text, timestamp: m.created_at,
        })));
      }
      setLoading(false);
    };

    fetchMessages();

    // SIMPLE REALTIME
    const channel = supabase.channel('room_main')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages'
    }, (payload) => {
      if (payload.new.family_id === FAMILY_ID) {
        const newMessage: FamilyMessage = {
          id: payload.new.id,
          authorId: payload.new.author_id,
          text: payload.new.text,
          timestamp: payload.new.created_at,
        };
        setMessages((prev) => [newMessage, ...prev]);
      }
    })
    .subscribe((status, err) => {
      setStatus(status);
      if (err) setDebug(`RTErr: ${err.message}`);
    });

    return () => { supabase.removeChannel(channel); };
  }, [activeMemberId]);

  const handlePost = async () => {
    if (!draft.trim()) return;
    const { error } = await supabase.from("messages").insert({
      author_id: activeMemberId,
      text: draft.trim(),
      family_id: FAMILY_ID,
    });
    if (error) setDebug(`PostErr: ${error.message}`);
    else setDraft("");
  };

  return (
    <ShellFrame>
      <div className="space-y-4 accent-sky">
        <PageHeader
          title="Messages"
          subtitle="Quick updates for the whole family."
          accent="sky"
          right={
            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${status === 'SUBSCRIBED' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{status}</span>
              </div>
              <span className="text-[8px] text-zinc-400 mt-1">v{APP_VERSION} | {debug}</span>
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
                className="min-h-[120px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Posting as <b>{activeMemberId}</b></span>
                <button onClick={handlePost} className="btnAccent rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  Post
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? <div className="text-center py-10 text-sm text-zinc-400">Syncing...</div> : messages.map((m) => (
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
