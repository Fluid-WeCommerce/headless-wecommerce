import type { Pricing } from "@/lib/fluid/types";

/** A price as Fluid formats it for the visitor's country, with any compare-at price struck through. */
export function Price({ pricing, className }: { pricing: Pricing | null | undefined; className?: string }) {
  if (!pricing?.display_price) return null;

  const compareAt =
    pricing.compare_at && pricing.price && Number(pricing.compare_at) > Number(pricing.price)
      ? formatMoney(pricing.compare_at, pricing.currency_code)
      : null;

  return (
    <span className={className}>
      <span>{pricing.display_price}</span>
      {compareAt ? <s className="ml-2 text-muted">{compareAt}</s> : null}
    </span>
  );
}

export function formatMoney(amount: string | number, currency: string | null | undefined): string {
  if (!currency) return String(amount);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(amount));
  } catch {
    return `${amount} ${currency}`;
  }
}
