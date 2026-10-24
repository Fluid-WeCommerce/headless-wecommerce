import type { ReactNode } from "react";

export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}
