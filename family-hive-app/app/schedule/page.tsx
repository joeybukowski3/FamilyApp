"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { supabase } from "@/app/lib/supabaseClient";
import { familyMembers } from "@/app/lib/mockData";
import { FamilyEvent } from "@/app/lib/scheduleStore";

// family_id used for scoping data to this family
const FAMILY_ID = "00000000-0000-0000-0000-000000000001";

export default function SchedulePage() {
  const user = useSupabaseUser();
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const displayName = useMemo(() => {
    return user?.user_metadata?.display_name as string | undefined;
  }, [user?.user_metadata?.display_name]);

  const activeMemberId = useMemo(() => {
    if (!user?.id) return "family";
    return familyMembers.find(
      (m) => m.id.toLowerCase() === user.id.toLowerCase()
    )?.id ?? "family";
  }, [user?.id]);

  const canEdit = Boolean(user);

  // 1. SELECT: Load schedule from Supabase on initial render
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .eq("family_id", FAMILY_ID)
        .order("start_iso", { ascending: true });

      if (error) {
        console.error("Error fetching schedule:", error);
      } else if (data) {
        const mapped: FamilyEvent[] = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          startISO: e.start_iso,
          notes: e.notes,
          createdByMemberId: e.author_id,
          createdAt: e.created_at,
        }));
        setEvents(mapped);
      }
      setLoading(false);
    };

    fetchSchedule();

    // 2. Realtime: Subscribe to all changes on the schedule table
    const channel = supabase
      .channel("schedule-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for INSERT, UPDATE, and DELETE
          schema: "public",
          table: "schedule",
          filter: `family_id=eq.${FAMILY_ID}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newEvent: FamilyEvent = {
              id: payload.new.id,
              title: payload.new.title,
              startISO: payload.new.start_iso,
              notes: payload.new.notes,
              createdByMemberId: payload.new.author_id,
              createdAt: payload.new.created_at,
            };
            setEvents((prev) => [...prev, newEvent].sort((a, b) => a.startISO.localeCompare(b.startISO)));
          } else if (payload.eventType === "DELETE") {
            setEvents((prev) => prev.filter((e) => e.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setEvents((prev) => 
              prev.map((e) => e.id === payload.new.id ? {
                id: payload.new.id,
                title: payload.new.title,
                startISO: payload.new.start_iso,
                notes: payload.new.notes,
                createdByMemberId: payload.new.author_id,
                createdAt: payload.new.created_at,
              } : e).sort((a, b) => a.startISO.localeCompare(b.startISO))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.startISO.localeCompare(b.startISO));
  }, [events]);

  // 3. INSERT: Add a new event to Supabase
  const handleAddEvent = async () => {
    if (!canEdit || !activeMemberId) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !date || !time) return;

    const startDate = new Date(`${date}T${time}`);
    if (Number.isNaN(startDate.getTime())) return;

    const { error } = await supabase.from("schedule").insert({
      title: trimmedTitle,
      start_iso: startDate.toISOString(),
      notes: notes.trim() ? notes.trim() : null,
      author_id: activeMemberId,
      family_id: FAMILY_ID,
    });

    if (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    } else {
      setTitle("");
      setDate("");
      setTime("");
      setNotes("");
    }
  };

  // 4. DELETE: Remove an event from Supabase
  const handleDeleteEvent = async (eventId: string) => {
    if (!canEdit) return;
    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
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
              Please sign in to add or delete events.{" "}
              <Link href="/login" className="font-semibold text-zinc-700">
                Go to sign in
              </Link>
            </div>
          )}
        </Card>

        <Card title="Upcoming">
          {!canEdit ? (
            <div className="mb-3 rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
              Viewing schedule in read-only mode.{" "}
              <Link href="/login" className="font-semibold text-zinc-700">
                Sign in to edit
              </Link>
            </div>
          ) : null}
          <div className="space-y-3">
            {loading ? (
              <div className="py-10 text-center text-sm text-zinc-400">Loading schedule...</div>
            ) : sortedEvents.length === 0 ? (
              <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 text-center">
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
