import Link from "next/link";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { listGroups, listItems } from "@/app/lib/listsMock";

export default function ListsPage() {
  return (
    <ShellFrame>
      <div className="grid gap-4 lg:grid-cols-2">
        {listGroups.map((group) => {
          const items = listItems.filter((item) => item.listId === group.id);
          return (
            <Card key={group.id} title={group.title}>
              <Link
                href={`/lists/${group.id}`}
                className="block rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition hover:bg-zinc-100"
              >
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="text-xs text-zinc-400">
                      No items yet. Add the first one.
                    </div>
                  ) : (
                    items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-zinc-300" />
                        <span>{item.text}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-3 text-xs text-zinc-400">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </ShellFrame>
  );
}
