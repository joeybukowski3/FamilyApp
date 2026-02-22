import Link from "next/link";

const navItems = [
  { label: "Feed", href: "/feed" },
  { label: "Lists", href: "/lists" },
  { label: "Calendar", href: "/calendar" },
  { label: "Profiles", href: "/profile/alex" },
];

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Family Hive
          </Link>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Private Family Space
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-6">
        <aside className="w-48 shrink-0">
          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-transparent px-3 py-2 font-medium text-zinc-600 transition hover:border-zinc-200 hover:bg-white hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-lg border border-dashed border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-500">
            TODO: Show family status, quick actions, and alerts here.
          </div>
        </aside>
        <main className="min-h-[480px] flex-1 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
