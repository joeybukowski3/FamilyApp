import { ReactNode } from "react";

export default function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(27,31,38,0.08)] ${className}`}
    >
      {title ? (
        <div className="mb-3 text-sm font-semibold text-zinc-700">{title}</div>
      ) : null}
      {children}
    </section>
  );
}
