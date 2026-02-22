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
