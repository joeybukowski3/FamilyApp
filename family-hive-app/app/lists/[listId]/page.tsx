import Link from "next/link";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { familyMembers } from "@/app/lib/mockData";
import { listGroups, listItems } from "@/app/lib/listsMock";

type Props = {
  params: { listId: string };
};

export default function ListDetailPage({ params }: Props) {
  const group = listGroups.find((entry) => entry.id === params.listId);

  if (!group) {
    return (
      <ShellFrame>
        <Card title="List not found">
          <div className="text-sm text-zinc-500">
            This list does not exist.{" "}
            <Link href="/lists" className="font-semibold text-zinc-700">
              Back to lists
            </Link>
          </div>
        </Card>
      </ShellFrame>
    );
  }

  const items = listItems.filter((item) => item.listId === group.id);

  return (
    <ShellFrame>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-700">
              {group.title}
            </div>
            <p className="text-xs text-zinc-400">
              {items.length} item{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
            disabled
          >
            Hide completed
          </button>
          <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
            <input
              type="text"
              placeholder="Add item..."
              className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600 sm:w-56"
              disabled
            />
            <button
              type="button"
              className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white opacity-60"
              disabled
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const creator = familyMembers.find(
              (member) => member.id === item.createdByMemberId
            );
            return (
              <label
                key={item.id}
                className="flex items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600"
              >
                <input type="checkbox" checked={Boolean(item.completedAt)} readOnly />
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      item.completedAt ? "line-through text-zinc-400" : ""
                    }`}
                  >
                    {item.text}
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {creator?.name ?? "Family"} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Card>
    </ShellFrame>
  );
}
