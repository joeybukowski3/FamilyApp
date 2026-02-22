"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const exchange = async () => {
      await supabase.auth.exchangeCodeForSession(window.location.href);
      router.replace("/");
    };
    exchange();
  }, [router]);

  return (
    <ShellFrame>
      <Card title="Signing you in">
        <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
          Completing your login...
        </div>
      </Card>
    </ShellFrame>
  );
}
