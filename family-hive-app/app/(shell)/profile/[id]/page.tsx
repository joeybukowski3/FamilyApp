import { familyMembers } from "@/app/lib/mockData";

export default function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const member = familyMembers.find((item) => item.id === params.id);
  const name = member?.name ?? "Family Member";
  const role = member?.role ?? "Member";
  const status = member?.status ?? "";

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="h-32 w-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50" />
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-semibold">
            {name.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            <p className="text-sm text-zinc-500">{role}</p>
            <p className="mt-2 text-sm text-zinc-600">
              {status || "TODO: Add a status update."}
            </p>
          </div>
        </div>
      </header>

      <section>
        <div className="flex flex-wrap gap-3 text-sm font-medium text-zinc-600">
          {["Posts", "Lists", "Events"].map((tab) => (
            <button
              key={tab}
              className="rounded-full border border-zinc-200 px-4 py-1.5 transition hover:bg-zinc-50"
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          TODO: Load profile-specific content for {name}.
        </div>
      </section>
    </div>
  );
}
