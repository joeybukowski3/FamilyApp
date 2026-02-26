"use client";

import { useEffect, useState } from "react";
import { getAuthUser } from "@/app/lib/authStore";

// Renamed logic to use our custom authStore while keeping the hook name for compatibility
export default function useSupabaseUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initial fetch of the authenticated user
    setUser(getAuthUser());

    // Listen for auth-change events to update the user state
    const handleAuthChange = () => {
      setUser(getAuthUser());
    };

    window.addEventListener("auth-change", handleAuthChange);
    // Also listen for storage changes (in case of other tabs/windows)
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return user;
}
