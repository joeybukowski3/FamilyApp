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
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card title="To-Do">
            <div className="space-y-3">
              {todos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3"
                >
                  <div className="text-sm text-zinc-600">{item.task}</div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-500 shadow">
                    {item.member}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Shared Photo Roll">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`photo-${index}`}
                  className="h-20 rounded-2xl bg-zinc-100"
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Family Message Board">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl bg-zinc-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-600">
                      {message.name}
                    </span>
                    <span>{message.time}</span>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Family Schedule">
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-zinc-400">
            {"SMTWTFS".split("").map((day, i) => (
  <div key={`${day}-${i}`}>{day}</div>
))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, index) => (
                <div
                  key={`day-${index}`}
                  className={`flex h-8 items-center justify-center rounded-lg text-xs ${
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
                  className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-2 text-sm text-zinc-600"
                >
                  <span>{event.title}</span>
                  <span className="text-xs text-zinc-400">{event.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ShellFrame>
  );
}
