"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import {
  familyMembers,
  familyMessages,
  FamilyMessage,
} from "@/app/lib/mockData";

const STORAGE_KEY = "family_messages";

export default function MessagesPage() {
  const user = useSupabaseUser();
  const [messages, setMessages] = useState<FamilyMessage[]>(familyMessages);
  const [draft, setDraft] = useState("");
  const displayName = useMemo(() => {
    return user?.user_metadata?.display_name as string | undefined;
  }, [user?.user_metadata?.display_name]);

  const activeMemberId = useMemo(() => {
    if (!user?.id) return "family";
    // Using the user id from our authStore which is the lowercase username
    return familyMembers.find(
      (m) => m.id.toLowerCase() === user.id.toLowerCase()
    )?.id ?? "family";
  }, [user?.id]);
  const canEdit = Boolean(user);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedMessages = window.localStorage.getItem(STORAGE_KEY);
    if (!storedMessages) return;

    try {
      const parsed = JSON.parse(storedMessages) as FamilyMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const handlePost = () => {
    if (!canEdit) return;
    const trimmed = draft.trim();
    if (!trimmed) return;

    const nextMessage: FamilyMessage = {
      id: `msg-${Date.now()}`,
      authorId: activeMemberId || familyMembers[0]?.id || "alex",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [nextMessage, ...prev];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    setDraft("");
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
              <path
                d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <Card>
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl bg-zinc-50 px-4 py-4">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                New message
              </label>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share an update with the family..."
                className="min-h-[120px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-zinc-400">
                  Posting as{" "}
                  <span className="font-semibold text-zinc-600">
                    {displayName ??
                      memberLookup.get(activeMemberId)?.name ??
                      "Family member"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePost}
                  className="btnAccent rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                  disabled={!canEdit}
                >
                  Post
                </button>
              </div>
            </div>

            {!canEdit ? (
              <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
                Unlock to post messages.{" "}
                <Link href="/login" className="font-semibold text-zinc-700">
                  Go to sign in
                </Link>
              </div>
            ) : null}

            <div className="space-y-3">
              {messages.map((message) => {
                const author = memberLookup.get(message.authorId);
                const authorLabel =
                  message.authorId === activeMemberId && displayName
                    ? displayName
                    : author?.name ?? message.authorId;
                return (
                  <div
                    key={message.id}
                    className="rounded-2xl bg-zinc-50 px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar memberId={message.authorId} size={28} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span className="font-semibold text-zinc-600">
                            {authorLabel}
                          </span>
                          <span>
                            {new Date(message.timestamp).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-zinc-600">
                          {message.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
