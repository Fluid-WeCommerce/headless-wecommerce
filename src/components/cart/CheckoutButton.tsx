"use client";

import { useSdkAction } from "@/lib/fairshare/hooks";

import { Button } from "../Button";

/**
 * Hands the cart to Fluid checkout. The SDK records the checkout start for
 * attribution and redirects to the cart's checkout URL, which carries the
 * visitor's session, so it works from any domain.
 */
export function CheckoutButton({ disabled, className }: { disabled?: boolean; className?: string }) {
  const [checkout, redirecting] = useSdkAction((sdk) => sdk.checkout());

  return (
    <Button className={className} disabled={disabled || redirecting} onClick={() => void checkout()}>
      {redirecting ? "Redirecting…" : "Checkout"}
    </Button>
  );
}
