import Link from "next/link";
import type { ReactNode } from "react";
import ActiveMemberBadge from "@/app/components/ActiveMemberBadge";

type Props = {
  children: ReactNode;
  familyName?: string;
};

const nav = [
  { href: "/lists", label: "Lists", icon: "??" },
  { href: "/photos", label: "Photos", icon: "???" },
  { href: "/messages", label: "Messages", icon: "??" },
  { href: "/schedule", label: "Schedule", icon: "??" },
  { href: "/profiles", label: "Profiles", icon: "??" },
];

export default function ShellFrame({
  children,
  familyName = "The Hive",
}: Props) {
  return (
    <div className="appShell">
      <header className="topBar">
        <div className="topBarLeft">
          <Link href="/" className="brand">
            <span className="brandIcon">??</span>
            <span className="brandText">Family Hive</span>
          </Link>
        </div>

        <div className="topBarCenter">{familyName}</div>

        <div className="topBarRight">
          <ActiveMemberBadge />
        </div>
      </header>

      <div className="shellBody">
        <aside className="sidebar">
          <nav className="navList">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="navItem">
                <span className="navIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="navLabel">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="mainContent">{children}</main>
      </div>
    </div>
  );
}
