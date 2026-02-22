"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { familyMembers } from "@/app/lib/mockData";
import {
  FamilyEvent,
  getSeedSchedule,
  hydrateSchedule,
  saveSchedule,
} from "@/app/lib/scheduleStore";

export default function SchedulePage() {
  const user = useSupabaseUser();
  const [events, setEvents] = useState<FamilyEvent[]>(getSeedSchedule);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setEvents(hydrateSchedule());
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const displayName = useMemo(() => {
    return (
      (user?.user_metadata?.display_name as string | undefined) ?? user?.email
    );
  }, [user?.email, user?.user_metadata?.display_name]);

  const activeMemberId = useMemo(() => {
    if (!user?.email) {
      return familyMembers[0]?.id ?? "family";
    }
    const local = user.email.split("@")[0]?.toLowerCase() ?? "";
    return (
      familyMembers.find(
        (member) =>
          member.id.toLowerCase() === local ||
          member.name.toLowerCase() === local
      )?.id ??
      familyMembers[0]?.id ??
      "family"
    );
  }, [user?.email]);

  const canEdit = Boolean(user);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.startISO.localeCompare(b.startISO));
  }, [events]);

  const handleAddEvent = () => {
    if (!canEdit || !activeMemberId) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !date || !time) return;

    const startDate = new Date(`${date}T${time}`);
    if (Number.isNaN(startDate.getTime())) return;

    const nextEvent: FamilyEvent = {
      id: `event-${Date.now()}`,
      title: trimmedTitle,
      startISO: startDate.toISOString(),
      notes: notes.trim() ? notes.trim() : undefined,
      createdByMemberId: activeMemberId,
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => {
      const updated = [nextEvent, ...prev];
      saveSchedule(updated);
      return updated;
    });

    setTitle("");
    setDate("");
    setTime("");
    setNotes("");
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!canEdit) return;
    setEvents((prev) => {
      const updated = prev.filter((event) => event.id !== eventId);
      saveSchedule(updated);
      return updated;
    });
  };

  return (
    <ShellFrame>
      <div className="space-y-4 accent-sun">
        <PageHeader
          title="Schedule"
          subtitle="Upcoming family plans and reminders."
          accent="sun"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 3v3M17 3v3M4 8h16M6 12h4m4 0h4M6 16h4m4 0h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                ry="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          }
        />

        <Card title="Add Event">
          {canEdit ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Event title"
                className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600"
                />
              </div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes (optional)"
                className="min-h-[96px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-zinc-400">
                  Adding as{" "}
                  <span className="font-semibold text-zinc-600">
                    {displayName ??
                      memberLookup.get(activeMemberId)?.name ??
                      "Family member"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="btnAccent rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Add Event
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-zinc-50 px-4 py-4 text-xs text-zinc-500">
              Unlock to add or delete events.{" "}
              <Link href="/unlock" className="font-semibold text-zinc-700">
                Go to unlock
              </Link>
            </div>
          )}
        </Card>

        <Card title="Upcoming">
          {!canEdit ? (
            <div className="mb-3 rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
              Viewing schedule in read-only mode.{" "}
              <Link href="/unlock" className="font-semibold text-zinc-700">
                Unlock editing
              </Link>
            </div>
          ) : null}
          <div className="space-y-3">
            {sortedEvents.length === 0 ? (
              <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
                No upcoming events yet.
              </div>
            ) : (
              sortedEvents.map((event) => {
                const creator = memberLookup.get(event.createdByMemberId);
                const creatorLabel =
                  event.createdByMemberId === activeMemberId && displayName
                    ? displayName
                    : creator?.name ?? "Family";
                return (
                  <div
                    key={event.id}
                    className="rounded-2xl bg-zinc-50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Avatar
                          memberId={event.createdByMemberId}
                          size={28}
                        />
                        <div>
                          <div className="text-sm font-semibold text-zinc-700">
                            {event.title}
                          </div>
                          <div className="mt-1 text-xs text-zinc-400">
                            {new Date(event.startISO).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}{" "}
                            - {creatorLabel}
                          </div>
                          {event.notes ? (
                            <div className="mt-2 text-xs text-zinc-500">
                              {event.notes}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {canEdit ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </ShellFrame>
  );
}
