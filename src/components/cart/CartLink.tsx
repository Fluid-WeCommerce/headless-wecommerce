"use client";

import { BagIcon } from "@/components/icons";
import { SiteLink } from "@/components/SiteLink";
import { cartItemCount, useCart } from "@/lib/fairshare/hooks";

/** The header's cart icon, with the number of items in the Fluid cart. */
export function CartLink() {
  const { cart } = useCart();
  const count = cartItemCount(cart);

  return (
    <SiteLink
      href="/cart"
      aria-label={count ? `Cart, ${count} items` : "Cart"}
      className="relative inline-flex size-10 items-center justify-center rounded-sm hover:bg-surface"
    >
      <BagIcon width={22} height={22} />
      {count ? (
        <span className="absolute right-0.5 top-0.5 inline-flex min-w-[1.125rem] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-medium leading-[1.125rem] text-brand-contrast">
          {count}
        </span>
      ) : null}
    </SiteLink>
  );
}
