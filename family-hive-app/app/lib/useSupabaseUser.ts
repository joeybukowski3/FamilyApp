"use client";

import { useEffect, useState } from "react";
import { getAuthUser } from "@/app/lib/authStore";

export default function useAuthUser() {
  // Use 'undefined' to represent the "loading/checking" state.
  // 'null' will explicitly mean "not logged in".
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    // Check session on the client immediately after mount
    const checkAuth = () => {
      setUser(getAuthUser() || null);
    };

    checkAuth();

    // Listen for auth-change events to update the user state across components
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return user;
}
