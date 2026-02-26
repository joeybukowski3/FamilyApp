"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to home since authentication is now handled locally
    router.replace("/");
  }, [router]);

  return null;
}
