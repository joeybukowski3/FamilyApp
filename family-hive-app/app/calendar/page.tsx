import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";

export default function CalendarPage() {
  return (
    <ShellFrame>
      <Card title="Calendar">
        <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
          TODO: Show upcoming events and reminders.
        </div>
      </Card>
    </ShellFrame>
  );
}
