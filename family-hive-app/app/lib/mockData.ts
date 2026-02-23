export type FamilyMember = {
  id: string;
  name: string;
  role: string;
  status: string;
  profileImage?: string;
};

export const familyMembers: FamilyMember[] = [
  { id: "joey", name: "joey", role: "Parent", status: "keeping it trill." },
  { id: "alejandra", name: "alejandra", role: "Parent", status: "what dat is" },
  { id: "camila", name: "camila", role: "Teen", status: "Working on school projects." },
  { id: "joseph", name: "joseph", role: "Kid", status: "I want to build apps." },
];

export const memberPins: Record<string, string> = {
  joey: "1102",
  alejandra: "1102",
  camila: "1102",
  joseph: "1102",
};

export const familyName = "Bukowski's";

export type FamilyMessage = {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
};

export const familyMessages: FamilyMessage[] = [
  {
    id: "msg-1",
    authorId: "joey",
    text: "Movie night is Friday. Add picks to the list!",
    timestamp: "2026-02-21T19:30:00.000Z",
  },
  {
    id: "msg-2",
    authorId: "alejandra",
    text: "Can someone grab extra milk?",
    timestamp: "2026-02-21T16:10:00.000Z",
  },
  {
    id: "msg-3",
    authorId: "camila",
    text: "I will be late to dinner tonight.",
    timestamp: "2026-02-20T22:05:00.000Z",
  },
];
