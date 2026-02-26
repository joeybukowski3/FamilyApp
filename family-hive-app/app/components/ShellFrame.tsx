"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import ActiveMemberBadge from "@/app/components/ActiveMemberBadge";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { logout } from "@/app/lib/authStore";

type Props = {
  children: ReactNode;
  familyName?: string;
};

const nav = [
  {
    href: "/lists",
    label: "Lists",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 6h14M6 12h14M6 18h14M3 6h.01M3 12h.01M3 18h.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/photos",
    label: "Photos",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 6h5l2-2h6l2 2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="13"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/schedule",
    label: "Schedule",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 3v3M17 3v3M4 8h16M6 12h4m4 0h4M6 16h4m4 0h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
          ry="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    href: "/profiles",
    label: "Profiles",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M16 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M4 21a8 8 0 0 1 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function ShellFrame({
  children,
  familyName = "Bukowski's",
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSupabaseUser();

  const displayName = user?.user_metadata?.display_name as string | undefined;

  // Enforce authentication: redirect unauthenticated users to /login
  useEffect(() => {
    if (!user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="topBarLeft">
          <Link href="/" className="brand">
            <span className="brandIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 6.5c2 2.5 4 2.5 6 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="brandText">Family Hive</span>
          </Link>
        </div>

        <div className="topBarCenter">{familyName}</div>

        <div className="topBarRight flex items-center gap-3">
          <ActiveMemberBadge />
          {user && (
            <button 
              onClick={handleLogout}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[10px] font-semibold text-zinc-500 hover:bg-zinc-50"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      <div className="shellBody">
        <aside className="sidebar">
          <nav className="navList">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navItem ${
                  pathname === item.href ? "navItemActive" : ""
                }`}
              >
                <span className="navIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="navLabel">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="mainContent container">
          {children}
        </main>
      </div>

      <footer className="mt-auto border-t border-zinc-200 bg-white p-6 text-center text-xs text-zinc-400">
        <div className="container">
          <p>© 2026 Family Hive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
