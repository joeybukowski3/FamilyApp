"use client";

import Link from "next/link";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { familyMembers } from "@/app/lib/mockData";

export default function ProfilesPage() {
  return (
    <ShellFrame>
      <Card title="Profiles">
        <div className="space-y-3">
          {familyMembers.map((member) => (
            <Link
              key={member.id}
              href={`/profile/${member.id}`}
              className="flex items-center gap-4 rounded-2xl bg-zinc-50 px-4 py-3 transition hover:bg-zinc-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg shadow">
                {member.name.slice(0, 1)}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-700">
                  {member.name}
                </div>
                <div className="text-xs text-zinc-500">{member.status}</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </ShellFrame>
  );
}
