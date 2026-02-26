"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnlockPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to home since authentication is now handled by the /login page
    router.replace("/");
  }, [router]);

  return null;
}
