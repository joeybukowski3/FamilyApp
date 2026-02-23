"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { familyMembers } from "@/app/lib/mockData";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";

export default function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = useSupabaseUser();
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ?? user?.email;
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(displayName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!editingName) {
      setDraftName(displayName ?? "");
    }
  }, [displayName, editingName]);

  const member = familyMembers.find((item) => item.id === params.id);
  const name = member?.name ?? "Family Member";
  const role = member?.role ?? "Member";
  const status = member?.status ?? "";

  return (
    <ShellFrame>
      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div className="h-32 w-full rounded-2xl bg-zinc-100" />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-lg font-semibold text-zinc-500 shadow">
                {name.slice(0, 1)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
                <p className="text-sm text-zinc-500">{role}</p>
                <p className="mt-2 text-sm text-zinc-600">
                  {status || "TODO: Add a status update."}
                </p>
              </div>
            </div>
            {user ? (
              <div className="rounded-2xl bg-zinc-50 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      Your display name
                    </div>
                    <div className="mt-2 text-sm font-semibold text-zinc-700">
                      {displayName ?? "No display name yet"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftName(displayName ?? "");
                      setEditingName((prev) => !prev);
                      setNameError(null);
                    }}
                    className="btnSecondary rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  >
                    {editingName ? "Cancel" : "Edit name"}
                  </button>
                </div>

                {editingName ? (
                  <div className="mt-3 grid gap-3">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="Enter display name"
                    />
                    {nameError ? (
                      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {nameError}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="btnPrimary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      onClick={async () => {
                        setNameError(null);
                        const trimmed = draftName.trim();
                        if (!trimmed) {
                          setNameError("Display name is required.");
                          return;
                        }
                        setSavingName(true);
                        const { error } = await supabase.auth.updateUser({
                          data: { display_name: trimmed },
                        });
                        setSavingName(false);
                        if (error) {
                          setNameError(error.message);
                          return;
                        }
                        setEditingName(false);
                      }}
                      disabled={savingName}
                    >
                      Save name
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap gap-3 text-sm font-medium text-zinc-600">
            {["Posts", "Lists", "Events"].map((tab) => (
              <button
                key={tab}
                className="rounded-full border border-zinc-200 px-4 py-1.5 transition hover:bg-zinc-50"
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-zinc-50 p-6 text-sm text-zinc-500">
            TODO: Load profile-specific content for {name}.
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
