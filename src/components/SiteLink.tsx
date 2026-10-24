"use client";

import Link from "next/link";
import { createContext, use, type ComponentProps, type ReactNode } from "react";

import { NO_CREDIT, sitePath } from "@/lib/fluid/routes";

const CreditContext = createContext<string>(NO_CREDIT);

/** Provides the visitor's credit slot (rep username or `home`) to every SiteLink below it. */
export function CreditProvider({ credit, children }: { credit: string; children: ReactNode }) {
  return <CreditContext value={credit}>{children}</CreditContext>;
}

/** The visitor's credit slot, for building links in client components. */
export function useCredit(): string {
  return use(CreditContext);
}

/**
 * `next/link` for storefront paths. Internal paths get the visitor's credit
 * slot, so `href="/shop"` links to `/jane/shop` for Jane's visitors and
 * `/home/shop` otherwise. External URLs pass through untouched.
 */
export function SiteLink({ href, ...props }: ComponentProps<typeof Link>) {
  const credit = useCredit();
  return <Link href={typeof href === "string" ? sitePath(credit, href) : href} {...props} />;
}
