import Link from "next/link";
import { familyMembers, familyName } from "@/app/lib/mockData";

const navItems = [
  { label: "Lists", href: "/lists" },
  { label: "Photos", href: "/photos" },
  { label: "Messages", href: "/messages" },
  { label: "Schedule", href: "/schedule" },
  { label: "Profiles", href: "/profile/alex" },
];

const iconMap: Record<string, string> = {
  Lists: "L",
  Photos: "P",
  Messages: "M",
  Schedule: "S",
  Profiles: "P",
};

export default function ShellFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const avatarSeed = familyMembers[0]?.name?.slice(0, 1) ?? "F";

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-zinc-800">
      <header className="border-b border-zinc-200/60 bg-[#f8f9fb]">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow">
              ¦
            </span>
            Family Hive
          </Link>
          <div className="text-sm font-medium text-zinc-500">{familyName}</div>
          <div className="flex justify-end">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold shadow">
              {avatarSeed}
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-6">
        <aside className="w-56 shrink-0">
          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-transparent bg-white/70 px-4 py-3 font-medium text-zinc-600 shadow-[0_6px_14px_rgba(27,31,38,0.06)] transition hover:bg-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
                  {iconMap[item.label]}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="relative flex-1 pb-20">
          {children}
          <button
            type="button"
            className="absolute bottom-0 right-0 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg"
          >
            New Post
          </button>
        </main>
      </div>
    </div>
  );
}
