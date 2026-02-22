export type FamilyMember = {
  id: string;
  name: string;
  role: string;
  status: string;
};

export const familyMembers: FamilyMember[] = [
  { id: "alex", name: "Alex", role: "Parent", status: "Planning spring break." },
  { id: "morgan", name: "Morgan", role: "Parent", status: "Adding grocery ideas." },
  { id: "jules", name: "Jules", role: "Teen", status: "Working on school projects." },
  { id: "remy", name: "Remy", role: "Kid", status: "Excited for movie night." },
];

export const memberPins: Record<string, string> = {
  alex: "1234",
  morgan: "2345",
  jules: "3456",
  remy: "4567",
};

export const familyName = "The Hive";

export type FamilyMessage = {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
};

export const familyMessages: FamilyMessage[] = [
  {
    id: "msg-1",
    authorId: "alex",
    text: "Movie night is Friday. Add picks to the list!",
    timestamp: "2026-02-21T19:30:00.000Z",
  },
  {
    id: "msg-2",
    authorId: "morgan",
    text: "Can someone grab extra milk?",
    timestamp: "2026-02-21T16:10:00.000Z",
  },
  {
    id: "msg-3",
    authorId: "jules",
    text: "I will be late to dinner tonight.",
    timestamp: "2026-02-20T22:05:00.000Z",
  },
];
