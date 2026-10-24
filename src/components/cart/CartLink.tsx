"use client";

import { SiteLink } from "@/components/SiteLink";

import { cartItemCount, useCart } from "@/lib/fairshare/hooks";

export function CartLink() {
  const { cart } = useCart();
  const count = cartItemCount(cart);

  return (
    <SiteLink href="/cart" className="relative inline-flex items-center gap-1 text-sm font-medium">
      Cart
      <span
        aria-label={`${count} items in cart`}
        className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs text-white"
      >
        {count}
      </span>
    </SiteLink>
  );
}
