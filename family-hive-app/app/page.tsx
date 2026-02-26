import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";

const todos = [
  { id: 1, task: "Plan weekend dinner", member: "A" },
  { id: 2, task: "Buy art supplies", member: "J" },
  { id: 3, task: "Confirm soccer time", member: "M" },
];

const messages = [
  {
    id: 1,
    name: "Alex",
    text: "Movie night is Friday. Add picks to the list!",
    time: "2h ago",
  },
  {
    id: 2,
    name: "Morgan",
    text: "Can someone grab extra milk?",
    time: "5h ago",
  },
  {
    id: 3,
    name: "Jules",
    text: "I will be late to dinner tonight.",
    time: "Yesterday",
  },
];

const events = [
  { id: 1, title: "School concert", day: "Thu" },
  { id: 2, title: "Family brunch", day: "Sat" },
  { id: 3, title: "Dentist", day: "Tue" },
];

export default function DashboardPage() {
  return (
    <ShellFrame>
      {/* 1. Added grid-cols-1 for explicit mobile stacking and responsive gaps */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div className="space-y-4 lg:space-y-6">
          <Card title="To-Do">
            <div className="space-y-3">
              {todos.map((item) => (
                {/* 2. Added gap-3 and shrink-0 so text and avatars don't overlap */}
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3"
                >
                  <div className="text-sm text-zinc-600 line-clamp-2">{item.task}</div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-500 shadow">
                    {item.member}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Shared Photo Roll">
            {/* 3. Made the photo grid gap responsive */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`photo-${index}`}
                  className="h-20 w-full rounded-2xl bg-zinc-100"
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Card title="Family Message Board">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl bg-zinc-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-600 truncate">
                      {message.name}
                    </span>
                    <span className="shrink-0">{message.time}</span>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Family Schedule">
            {/* 4. Reduced calendar gaps on mobile to prevent horizontal overflow */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] text-zinc-400">
              {"SMTWTFS".split("").map((day, i) => (
                <div key={`${day}-${i}`}>{day}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: 28 }).map((_, index) => (
                <div
                  key={`day-${index}`}
                  className={`flex h-8 w-full items-center justify-center rounded-lg text-xs ${
                    index % 6 === 0 ? "bg-zinc-900 text-white" : "bg-zinc-100"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-2 text-sm text-zinc-600"
                >
                  <span className="truncate">{event.title}</span>
                  <span className="shrink-0 text-xs text-zinc-400">{event.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ShellFrame>
  );
}
