import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Family Hive Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome home.</h1>
        <p className="max-w-2xl text-sm text-zinc-500">
          This is the shared family space for updates, lists, and upcoming plans.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {["New in the feed", "Active lists", "Upcoming events"].map((title) => (
          <div
            key={title}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <h2 className="text-sm font-semibold text-zinc-700">{title}</h2>
            <p className="mt-2 text-xs text-zinc-500">
              TODO: Populate this card with mocked content.
            </p>
          </div>
        ))}
      </section>
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-700">Quick links</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link className="text-zinc-600 underline" href="/feed">
            Go to Feed
          </Link>
          <Link className="text-zinc-600 underline" href="/lists">
            Manage Lists
          </Link>
          <Link className="text-zinc-600 underline" href="/calendar">
            View Calendar
          </Link>
          <Link className="text-zinc-600 underline" href="/profile/alex">
            Open Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
