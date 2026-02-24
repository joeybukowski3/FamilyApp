"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";

export default function UnlockPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://family-app-peach.vercel.app/",
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Check your email for the magic link!");
    }
    setLoading(false);
  };

  return (
    <ShellFrame>
      <div className="max-w-md mx-auto mt-10">
        <Card title="Unlock FamilyApp">
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-sm text-zinc-500">
              Enter your email to receive a secure login link.
            </p>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full btnAccent rounded-lg py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
            {message && (
              <p className="text-center text-xs font-medium text-mint-600">
                {message}
              </p>
            )}
          </form>
        </Card>
      </div>
    </ShellFrame>
  );
}