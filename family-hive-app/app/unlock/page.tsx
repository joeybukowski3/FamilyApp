"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { supabase } from "@/app/lib/supabaseClient";
import useSupabaseUser from "@/app/lib/useSupabaseUser";

export default function UnlockPage() {
  const user = useSupabaseUser();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSendLink = async () => {
    setError(null);
    setStatus(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email.");
      return;
    }

    setSending(true);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setSending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setStatus("Magic link sent. Check your inbox to finish signing in.");
    setEmail("");
  };

  return (
    <ShellFrame>
      <div className="max-w-2xl">
        <Card title="Unlock">
          <div className="text-sm text-zinc-600">
            Sign in with your email to unlock editing (lists, messages, and
            more).
          </div>

          <div className="mt-5 grid gap-3">
            <label className="text-xs font-semibold text-zinc-500">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            {status ? (
              <div className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {status}
              </div>
            ) : null}

            {error ? (
              <div className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSendLink}
                className="btnPrimary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                disabled={sending}
              >
                Send magic link
              </button>

              {user ? (
                <div className="rounded-full bg-zinc-50 px-4 py-2 text-xs text-zinc-500">
                  Logged in as{" "}
                  <span className="font-semibold text-zinc-700">
                    {user.email}
                  </span>
                </div>
              ) : null}

              <Link
                href="/"
                className="btnSecondary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Back Home
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
