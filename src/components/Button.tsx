import type { ButtonHTMLAttributes, ComponentProps } from "react";

import { SiteLink } from "./SiteLink";

const variants = {
  primary: "bg-brand text-white hover:opacity-90",
  secondary: "border border-border bg-background text-foreground hover:bg-surface",
} as const;

type Variant = keyof typeof variants;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className ?? ""}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof SiteLink> & { variant?: Variant }) {
  return <SiteLink className={`${base} ${variants[variant]} ${className ?? ""}`} {...props} />;
}
