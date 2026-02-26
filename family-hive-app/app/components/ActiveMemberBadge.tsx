"use client";

import Link from "next/link";
import { useState } from "react";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { logout } from "@/app/lib/authStore";
import { useRouter } from "next/navigation";

export default function ActiveMemberBadge() {
  const user = useSupabaseUser();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    // Use our new local logout instead of Supabase
    logout();
    router.push("/login");
    setSigningOut(false);
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="pillActive rounded-full px-3 py-1">Locked</span>
        <Link
          href="/login"
          className="btnSecondary rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const displayName = user.user_metadata?.display_name as string;

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-semibold text-zinc-700">{displayName}</div>
      <div className="flex items-center gap-2">
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
