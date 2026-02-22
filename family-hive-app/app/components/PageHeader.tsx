import type { ReactNode } from "react";

type Accent = "mint" | "sky" | "coral" | "lavender" | "sun";

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: Accent;
  right?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  icon,
  accent,
  right,
}: Props) {
  const accentClass = accent ? `accent-${accent}` : "";

  return (
    <div className={`pageHeader ${accentClass}`}>
      <div className="pageHeaderLeft">
        {icon ? <span className="pageHeaderIcon">{icon}</span> : null}
        <div>
          <div className="pageHeaderTitle">{title}</div>
          {subtitle ? (
            <div className="pageHeaderSubtitle">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {right ? <div className="pageHeaderRight">{right}</div> : null}
    </div>
  );
}
