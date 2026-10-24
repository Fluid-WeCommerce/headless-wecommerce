import type { ReactNode } from "react";

import { RichText } from "@/components/RichText";

/** The title block at the top of list and record pages. */
export function PageHeader({
  title,
  eyebrow,
  description,
  html,
  children,
}: {
  title: string;
  eyebrow?: ReactNode;
  description?: string | null;
  html?: boolean;
  children?: ReactNode;
}) {
  return (
    <header className="page-width pb-10 pt-12 sm:pb-14 sm:pt-20">
      {eyebrow ? <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted">{eyebrow}</p> : null}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
      {description ? (
        html ? (
          <RichText html={description} className="mt-5 max-w-2xl text-lg text-muted" />
        ) : (
          <p className="mt-5 max-w-2xl text-lg text-muted">{description}</p>
        )
      ) : null}
      {children}
    </header>
  );
}
