"use client";

import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { familyMembers } from "@/app/lib/mockData";
import useSupabaseUser from "@/app/lib/useSupabaseUser";

export default function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = useSupabaseUser();
  const displayName = user?.user_metadata?.display_name as string | undefined;

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
                  {/* Name editing removed as usernames are now fixed in the PIN system */}
                </div>
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
