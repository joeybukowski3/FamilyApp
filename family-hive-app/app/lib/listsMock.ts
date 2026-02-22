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

export const listGroups: ListGroup[] = [
  { id: "todo", title: "To-Do", type: "todo" },
  { id: "wishlist", title: "Wish List", type: "wishlist" },
  { id: "christmas", title: "Christmas List", type: "christmas" },
  { id: "custom", title: "Custom", type: "custom" },
];

export const listItems: ListItem[] = [
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
