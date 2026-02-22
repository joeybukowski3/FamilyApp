import { familyMembers } from "@/app/lib/mockData";

type Props = {
  memberId: string;
  size?: number;
  className?: string;
};

const pastelPalette = [
  "#7cc8a1",
  "#7bb5d9",
  "#f3a1a1",
  "#b5a6f0",
  "#f2c26b",
  "#8ecad3",
];

const getColorForId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % pastelPalette.length;
  }
  return pastelPalette[hash];
};

export default function Avatar({ memberId, size = 32, className = "" }: Props) {
  const member = familyMembers.find((entry) => entry.id === memberId);
  const name = member?.name ?? "Family";
  const initial = name.slice(0, 1).toUpperCase() || "F";
  const backgroundColor = getColorForId(memberId);

  const sharedStyle = {
    width: size,
    height: size,
  } as const;

  if (member?.profileImage) {
    return (
      <img
        src={member.profileImage}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={sharedStyle}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full text-xs font-semibold text-white ${className}`}
      style={{ ...sharedStyle, backgroundColor }}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
