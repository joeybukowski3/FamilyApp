"use client";

// Hardcoded allowed users and fixed PIN as requested
const ALLOWED_USERS = ["Joseph", "Joey", "Ale", "Camila"];
const VALID_PIN = "1102";
const STORAGE_KEY = "family_auth_session";

export type AuthUser = {
  id: string;
  username: string;
  // Mocking Supabase user structure to maintain app compatibility
  user_metadata: {
    display_name: string;
  };
};

export const login = (username: string, pin: string): { success: boolean; error?: string } => {
  if (typeof window === "undefined") return { success: false };

  const matchedUser = ALLOWED_USERS.find(
    (u) => u.toLowerCase() === username.toLowerCase()
  );

  if (!matchedUser) {
    return { success: false, error: "Invalid username." };
  }

  if (pin !== VALID_PIN) {
    return { success: false, error: "Incorrect PIN." };
  }

  const user: AuthUser = {
    id: matchedUser.toLowerCase(),
    username: matchedUser,
    user_metadata: {
      display_name: matchedUser,
    },
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Dispatch a custom event to notify useAuthUser hooks in other tabs/components
  window.dispatchEvent(new Event("auth-change"));
  
  return { success: true };
};

export const logout = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("auth-change"));
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
