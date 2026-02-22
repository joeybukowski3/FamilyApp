export type FamilyEvent = {
  id: string;
  title: string;
  startISO: string;
  notes?: string;
  createdByMemberId: string;
  createdAt: string;
};

const STORAGE_KEY = "family_schedule_v1";

const seedEvents: FamilyEvent[] = [
  {
    id: "event-1",
    title: "Family breakfast",
    startISO: "2026-02-22T14:00:00.000Z",
    notes: "Pancakes + smoothie bar.",
    createdByMemberId: "joey",
    createdAt: "2026-02-21T18:30:00.000Z",
  },
  {
    id: "event-2",
    title: "Soccer practice",
    startISO: "2026-02-23T23:30:00.000Z",
    createdByMemberId: "camila",
    createdAt: "2026-02-21T19:15:00.000Z",
  },
  {
    id: "event-3",
    title: "Grocery run",
    startISO: "2026-02-24T23:00:00.000Z",
    notes: "Restock snack bins.",
    createdByMemberId: "alejandra",
    createdAt: "2026-02-22T08:10:00.000Z",
  },
  {
    id: "event-4",
    title: "Game night",
    startISO: "2026-02-26T01:00:00.000Z",
    notes: "Choose two new games.",
    createdByMemberId: "joseph",
    createdAt: "2026-02-22T09:05:00.000Z",
  },
  {
    id: "event-5",
    title: "School project check-in",
    startISO: "2026-02-27T22:00:00.000Z",
    createdByMemberId: "camila",
    createdAt: "2026-02-22T09:20:00.000Z",
  },
];

export const getSeedSchedule = () => seedEvents;

const isValidSchedule = (data: unknown): data is FamilyEvent[] => {
  return Array.isArray(data);
};

export const hydrateSchedule = (): FamilyEvent[] => {
  if (typeof window === "undefined") {
    return getSeedSchedule();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seed = getSeedSchedule();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(stored);
    if (isValidSchedule(parsed)) {
      return parsed;
    }
  } catch {
    // fallthrough to reseed
  }

  window.localStorage.removeItem(STORAGE_KEY);
  const seed = getSeedSchedule();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

export const saveSchedule = (events: FamilyEvent[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};
