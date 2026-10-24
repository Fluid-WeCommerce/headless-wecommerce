import type { ButtonHTMLAttributes, ComponentProps } from "react";

import { SiteLink } from "./SiteLink";

const variants = {
  /** Filled with the brand color from Fluid admin. */
  primary: "bg-brand text-brand-contrast hover:opacity-85",
  /** Outlined, for secondary actions on light backgrounds. */
  secondary: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
  /** White, for primary actions on dark backgrounds. */
  light: "bg-white text-black hover:bg-white/85",
  /** Outlined white, for secondary actions on dark backgrounds. */
  outlineLight: "border border-white text-white hover:bg-white hover:text-black",
} as const;

export type ButtonVariant = keyof typeof variants;

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-sm px-6 text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function buttonClass(variant: ButtonVariant = "primary", className?: string): string {
  return `${base} ${variants[variant]} ${className ?? ""}`;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof SiteLink> & { variant?: ButtonVariant }) {
  return <SiteLink className={buttonClass(variant, className)} {...props} />;
}
