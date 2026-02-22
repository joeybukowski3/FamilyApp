import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";

export default function ListsPage() {
  return (
    <ShellFrame>
      <Card title="Lists">
        <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
          TODO: Add list groups (todo, wishlist, holiday, custom).
        </div>
      </Card>
    </ShellFrame>
  );
}
