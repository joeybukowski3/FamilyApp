"use client";

import { useEffect, useState } from "react";
import { familyMembers, memberPins } from "@/app/lib/mockData";

const SESSION_KEY = "family-hive-session";

type SessionState = {
  memberId: string;
  unlocked: boolean;
};

export default function UnlockPage() {
  const [memberId, setMemberId] = useState(familyMembers[0]?.id ?? "");
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as SessionState;
      setSession(parsed);
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const handleUnlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memberId) return;

    if (memberPins[memberId] === pin) {
      const nextSession: SessionState = { memberId, unlocked: true };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setStatus("success");
      setPin("");
      return;
    }

    setStatus("error");
  };

  const handleClear = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Family Hive
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Unlock your space</h1>
          <p className="text-sm text-zinc-500">
            Choose a family member and enter their PIN to continue.
          </p>
        </header>

        <form
          onSubmit={handleUnlock}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <label className="flex flex-col gap-2 text-sm font-medium">
            Member
            <select
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
            >
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {member.role}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            PIN
            <input
              type="password"
              inputMode="numeric"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="Enter 4-digit PIN"
            />
          </label>

          {status === "error" ? (
            <p className="text-sm text-red-500">
              That PIN does not match. Try again.
            </p>
          ) : null}
          {status === "success" ? (
            <p className="text-sm text-green-600">
              Unlocked! You can head back to the dashboard.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600"
            >
              Clear session
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-500">
          Session stored locally: {session ? `${session.memberId} unlocked` : "none"}.
          TODO: Replace with secure auth + server session.
        </div>
      </div>
    </div>
  );
}
