export type ListGroup = {
  id: string;
  title: string;
  type: "todo" | "wishlist" | "christmas" | "custom";
};

export type ListItem = {
  id: string;
  listId: string;
  text: string;
  createdAt: string;
  createdByMemberId: string;
  completedAt?: string;
};

export type ListsState = {
  groups: ListGroup[];
  items: ListItem[];
};

const STORAGE_KEY = "family_lists_v1";

const seedGroups: ListGroup[] = [
  { id: "todo", title: "To-Do", type: "todo" },
  { id: "wishlist", title: "Wish List", type: "wishlist" },
  { id: "christmas", title: "Christmas List", type: "christmas" },
  { id: "custom", title: "Custom", type: "custom" },
];

const seedItems: ListItem[] = [
  {
    id: "todo-1",
    listId: "todo",
    text: "Plan weekend dinner",
    createdAt: "2026-02-21T17:20:00.000Z",
    createdByMemberId: "alex",
  },
  {
    id: "todo-2",
    listId: "todo",
    text: "Buy art supplies",
    createdAt: "2026-02-21T18:05:00.000Z",
    createdByMemberId: "jules",
    completedAt: "2026-02-21T21:30:00.000Z",
  },
  {
    id: "wishlist-1",
    listId: "wishlist",
    text: "New blender",
    createdAt: "2026-02-20T14:10:00.000Z",
    createdByMemberId: "morgan",
  },
  {
    id: "wishlist-2",
    listId: "wishlist",
    text: "Sketchbook set",
    createdAt: "2026-02-20T16:45:00.000Z",
    createdByMemberId: "jules",
  },
  {
    id: "christmas-1",
    listId: "christmas",
    text: "Board game night kit",
    createdAt: "2026-02-19T19:00:00.000Z",
    createdByMemberId: "alex",
  },
  {
    id: "custom-1",
    listId: "custom",
    text: "Spring break packing list",
    createdAt: "2026-02-18T12:30:00.000Z",
    createdByMemberId: "morgan",
  },
];

export const getSeedLists = (): ListsState => ({
  groups: seedGroups,
  items: seedItems,
});

const isValidState = (data: unknown): data is ListsState => {
  if (!data || typeof data !== "object") return false;
  const candidate = data as ListsState;
  return Array.isArray(candidate.groups) && Array.isArray(candidate.items);
};

export const hydrateLists = (): ListsState => {
  if (typeof window === "undefined") {
    return getSeedLists();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seed = getSeedLists();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(stored);
    if (isValidState(parsed)) {
      return parsed;
    }
  } catch {
    // fallthrough to reseed
  }

  window.localStorage.removeItem(STORAGE_KEY);
  const seed = getSeedLists();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

export const saveLists = (state: ListsState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
