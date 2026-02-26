"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to home since setup is no longer needed with the new PIN system
    router.replace("/");
  }, [router]);

  return null;
}
