"use client";

import Link from "next/link";
import { useState } from "react";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";

export default function ActiveMemberBadge() {
  const user = useSupabaseUser();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    window.location.assign("/");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="pillActive rounded-full px-3 py-1">Locked</span>
        <Link
          href="/unlock"
          className="btnSecondary rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          Unlock
        </Link>
      </div>
    );
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ?? user.email;

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-semibold text-zinc-700">{displayName}</div>
      <div className="flex items-center gap-2">
        <Link
          href="/unlock"
          className="btnSecondary rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          Switch
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="btnPrimary rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
          disabled={signingOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
