"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { login } from "@/app/lib/authStore";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Using the new simple auth logic with username and PIN
    const result = login(username, pin);
    setLoading(false);

    if (result.success) {
      // If login is successful, redirect to the home page
      router.push("/");
    } else {
      // Display a simple error message on failure
      setError(result.error ?? "Invalid login credentials.");
    }
  };

  return (
    <ShellFrame>
      <div className="mx-auto mt-10 max-w-md">
        <Card title="Family Sign In">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-500 uppercase">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-500 uppercase">
                PIN
              </label>
              <input
                type="password"
                placeholder="Enter 4-digit PIN"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <p className="rounded-lg bg-red-50 py-2 text-center text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btnAccent w-full rounded-xl py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <p className="mt-6 text-center text-[10px] text-zinc-400">
            Private family access only.
          </p>
        </Card>
      </div>
    </ShellFrame>
  );
}
