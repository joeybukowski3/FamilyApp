"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import ProfileSetupModal from "@/app/components/ProfileSetupModal";
import { familyMembers, memberPins } from "@/app/lib/mockData";

type Session = {
  memberId: string;
  unlocked: boolean;
};

const SESSION_KEY = "family-hive-session";

export default function UnlockPage() {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    familyMembers[0]?.id ?? ""
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlockedMemberId, setUnlockedMemberId] = useState<string | null>(null);

  const selectedMember = useMemo(
    () => familyMembers.find((m) => m.id === selectedMemberId) ?? null,
    [selectedMemberId]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<Session>;
      if (parsed.unlocked && parsed.memberId) {
        setUnlockedMemberId(parsed.memberId);
        setSelectedMemberId(parsed.memberId);
      }
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const handleUnlock = () => {
    setError(null);

    if (!selectedMemberId) {
      setError("Select a family member first.");
      return;
    }

    const expectedPin = memberPins[selectedMemberId];
    if (!expectedPin) {
      setError("No PIN configured for this member yet.");
      return;
    }

    if (pin.trim() !== expectedPin) {
      setError("Incorrect PIN.");
      return;
    }

    const session: Session = { memberId: selectedMemberId, unlocked: true };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUnlockedMemberId(selectedMemberId);
    setPin("");
  };

  const handleLock = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setUnlockedMemberId(null);
    setPin("");
    setError(null);
  };

  return (
    <ShellFrame>
      <div className="max-w-2xl">
        <Card title="Unlock">
          <div className="text-sm text-zinc-600">
            Choose your profile and enter your passcode to unlock editing (lists,
            messages, and more).
          </div>

          <div className="mt-5 grid gap-3">
            <label className="text-xs font-semibold text-zinc-500">
              Family Member
            </label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <label className="mt-3 text-xs font-semibold text-zinc-500">
              Passcode (PIN)
            </label>
            <input
              type="password"
              inputMode="numeric"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
            />

            {error ? (
              <div className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUnlock}
                className="btnPrimary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Unlock
              </button>

              {unlockedMemberId ? (
                <button
                  type="button"
                  onClick={handleLock}
                  className="btnSecondary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Lock
                </button>
              ) : null}

              <Link
                href="/"
                className="btnSecondary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Back Home
              </Link>
            </div>

            <div className="mt-4 text-xs text-zinc-500">
              Tip: If you haven’t set up your profile yet, use the Profile Setup
              modal.
            </div>
          </div>
        </Card>

        {/* Optional: keep the setup modal available from here */}
        <ProfileSetupModal
          open={!selectedMember && familyMembers.length === 0}
          onClose={() => void 0}
        />
      </div>
    </ShellFrame>
  );
}
