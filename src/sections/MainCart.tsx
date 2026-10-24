"use client";

import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { useCart, useSdkAction } from "@/lib/fairshare/hooks";
import type { CartLine } from "@/lib/fairshare/sdk";

import { EmptyState } from "./EmptyState";

/** The cart page body. The cart itself lives in Fluid and is read through the SDK. */
export function MainCart() {
  const { cart, loading } = useCart();
  const items = cart?.items ?? [];

  if (loading && !cart) {
    return <div aria-busy className="h-64 animate-pulse rounded-sm bg-surface" />;
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        text="Find something you love and it will show up here."
        action={{ label: "Continue shopping", href: "/shop" }}
      />
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <ul className="divide-y divide-border border-t border-border">
        {items.map((item) => (
          <CartRow key={item.id} item={item} />
        ))}
      </ul>
      <aside className="h-fit space-y-5 rounded-sm border border-border p-6 sm:p-8 lg:sticky lg:top-28">
        <h2 className="text-xl font-bold tracking-tight">Order summary</h2>
        <div className="space-y-3 text-[15px]">
          <SummaryRow label="Subtotal" value={cart?.sub_total_in_currency} />
          {(cart?.discount_total ?? 0) > 0 ? (
            <SummaryRow label="Discounts" value={`−${cart?.discount_total_in_currency}`} />
          ) : null}
        </div>
        <p className="border-t border-border pt-5 text-sm text-muted">Shipping and taxes are calculated at checkout.</p>
        <CheckoutButton className="w-full" />
      </aside>
    </div>
  );
}

function CartRow({ item }: { item: CartLine }) {
  const variantId = item.variant?.id;
  const [setQuantity, updating] = useSdkAction((sdk, quantity: number) =>
    variantId ? sdk.updateCartItems([{ variant_id: variantId, quantity }]) : undefined,
  );
  const [remove, removing] = useSdkAction((sdk) => sdk.removeCartItemById(item.id));
  const image = item.image_url ?? item.variant?.image_url ?? item.product?.image_url;
  const busy = updating || removing;

  return (
    <li className={`flex gap-5 py-6 transition-opacity sm:gap-6 ${busy ? "opacity-50" : ""}`}>
      <div className="size-24 shrink-0 overflow-hidden rounded-sm bg-surface sm:size-32">
        {/* eslint-disable-next-line @next/next/no-img-element -- Fluid cart images are already sized. */}
        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex justify-between gap-4">
          <div>
            <p className="font-medium">{item.title}</p>
            {item.variant?.title ? <p className="mt-1 text-sm text-muted">{item.variant.title}</p> : null}
            {item.subscription ? <p className="mt-1 text-sm text-muted">Subscription</p> : null}
          </div>
          <p className="text-right font-medium">{item.line_total_in_currency ?? item.price_in_currency}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-10 items-center rounded-sm border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={busy || !variantId || item.quantity <= 1}
              onClick={() => void setQuantity(item.quantity - 1)}
              className="flex h-full w-10 items-center justify-center disabled:opacity-30"
            >
              <MinusIcon width={14} height={14} />
            </button>
            <span aria-label="Quantity" className="w-8 text-center text-sm">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={busy || !variantId}
              onClick={() => void setQuantity(item.quantity + 1)}
              className="flex h-full w-10 items-center justify-center disabled:opacity-30"
            >
              <PlusIcon width={14} height={14} />
            </button>
          </div>
          <button
            type="button"
            className="text-sm text-muted underline underline-offset-4 hover:text-foreground"
            disabled={busy}
            onClick={() => void remove()}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
