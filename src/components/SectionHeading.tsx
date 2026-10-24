import type { ReactNode } from "react";

import { ArrowRightIcon } from "./icons";
import { SiteLink } from "./SiteLink";

/** A section's title, with an optional eyebrow and "view all" link. */
export function SectionHeading({
  title,
  eyebrow,
  link,
  children,
}: {
  title: string;
  eyebrow?: string;
  link?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        {eyebrow ? <p className="text-sm font-medium uppercase tracking-wider text-muted">{eyebrow}</p> : null}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {link ? (
        <SiteLink href={link.href} className="group inline-flex items-center gap-2 text-[15px] font-medium">
          {link.label}
          <ArrowRightIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
        </SiteLink>
      ) : null}
      {children}
    </div>
  );
}
