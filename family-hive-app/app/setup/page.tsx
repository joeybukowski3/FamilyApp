"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { supabase } from "@/app/lib/supabaseClient";
import useSupabaseUser from "@/app/lib/useSupabaseUser";

export default function SetupPage() {
  const user = useSupabaseUser();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.display_name) {
      router.replace("/");
    }
  }, [router, user?.user_metadata?.display_name]);

  const handleSave = async () => {
    setError(null);
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError("Display name is required.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({
      data: { display_name: trimmed },
    });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace("/");
  };

  return (
    <ShellFrame>
      <div className="max-w-2xl">
        <Card title="Finish setup">
          <div className="text-sm text-zinc-600">
            Choose a display name. This is what your family will see in the app.
          </div>

          <div className="mt-5 grid gap-3">
            <label className="text-xs font-semibold text-zinc-500">
              Display name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
            />

            {error ? (
              <div className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="btnPrimary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
