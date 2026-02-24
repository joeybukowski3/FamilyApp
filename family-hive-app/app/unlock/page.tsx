"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";

export default function UnlockPage() {
  const [view, setView] = useState<"email" | "setup" | "pin">("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check if we just arrived from a Magic Link
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('username').single();
        profile?.username ? setView("pin") : setView("setup");
      }
    };
    checkUser();
  }, []);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://family-app-peach.vercel.app/unlock" },
    });
    setMessage(error ? error.message : "Check your email!");
    setLoading(false);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save Display Name and PIN
    await supabase.auth.updateUser({ data: { display_name: username } });
    await supabase.from('profiles').upsert({ id: user.id, username, pin_hash: pin });
    
    window.location.href = "/lists";
  };

  return (
    <ShellFrame>
      <div className="max-w-md mx-auto mt-10">
        <Card title={view === "email" ? "Get Started" : view === "setup" ? "Set Profile" : "Enter PIN"}>
          <form onSubmit={view === "email" ? handleMagicLink : handleSetup} className="space-y-4">
            {view === "email" && (
              <input type="email" placeholder="Email" className="w-full rounded-lg border p-2" onChange={e => setEmail(e.target.value)} required />
            )}
            {view === "setup" && (
              <>
                <input type="text" placeholder="Username" className="w-full rounded-lg border p-2" onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="4-Digit PIN" className="w-full rounded-lg border p-2" onChange={e => setPin(e.target.value)} required />
              </>
            )}
            <button type="submit" className="w-full btnAccent rounded-lg py-2 font-bold uppercase tracking-widest">
              {loading ? "Processing..." : "Continue"}
            </button>
            {message && <p className="text-center text-xs text-mint-600">{message}</p>}
          </form>
        </Card>
      </div>
    </ShellFrame>
  );
}