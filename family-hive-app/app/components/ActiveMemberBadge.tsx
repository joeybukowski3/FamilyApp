"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { familyMembers } from "@/app/lib/mockData";

type SessionState = {
  memberId?: string;
  unlocked?: boolean;
};

export default function ActiveMemberBadge() {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [lockRequested, setLockRequested] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedSession = window.localStorage.getItem("family-hive-session");
    if (!storedSession) return;

    try {
      const parsed = JSON.parse(storedSession) as SessionState;
      if (parsed.unlocked && parsed.memberId) {
        setActiveMemberId(parsed.memberId);
      }
    } catch {
      window.localStorage.removeItem("family-hive-session");
    }
  }, []);

  useEffect(() => {
    if (!lockRequested || typeof window === "undefined") return;
    window.localStorage.removeItem("family-hive-session");
    setActiveMemberId(null);
    window.location.assign("/");
  }, [lockRequested]);

  const activeMember = useMemo(() => {
    return familyMembers.find((member) => member.id === activeMemberId) ?? null;
  }, [activeMemberId]);

  const initials = useMemo(() => {
    const name = activeMember?.name ?? "";
    if (!name) return "FH";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [activeMember?.name]);

  if (!activeMember) {
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

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {activeMember.profileImage ? (
          <img
            src={activeMember.profileImage}
            alt={activeMember.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-600">
            {initials}
          </div>
        )}
        <div className="text-sm font-semibold text-zinc-700">
          {activeMember.name}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/unlock"
          className="btnSecondary rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          Switch
        </Link>
        <button
          type="button"
          onClick={() => setLockRequested(true)}
          className="btnPrimary rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          Lock
        </button>
      </div>
    </div>
  );
}
