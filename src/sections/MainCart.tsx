"use client";

import { ButtonLink } from "@/components/Button";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { useCart, useSdkAction } from "@/lib/fairshare/hooks";
import type { CartLine } from "@/lib/fairshare/sdk";

/** The cart page body. The cart itself lives in Fluid and is read through the SDK. */
export function MainCart() {
  const { cart, loading } = useCart();
  const items = cart?.items ?? [];

  if (loading && !cart) return <p className="py-16 text-center text-muted">Loading your cart…</p>;

  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <ButtonLink href="/shop" className="mt-6">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <CartRow key={item.id} item={item} />
        ))}
      </ul>
      <aside className="h-fit space-y-4 rounded-2xl bg-surface p-6">
        <SummaryRow label="Subtotal" value={cart?.sub_total_in_currency} />
        {(cart?.discount_total ?? 0) > 0 ? (
          <SummaryRow label="Discounts" value={`−${cart?.discount_total_in_currency}`} />
        ) : null}
        <p className="text-sm text-muted">Shipping and taxes are calculated at checkout.</p>
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
    <li className={`flex gap-4 py-6 ${busy ? "opacity-60" : ""}`}>
      <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element -- Fluid cart images are already sized. */}
        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row">
        <div>
          <p className="font-medium">{item.title}</p>
          {item.variant?.title ? <p className="text-sm text-muted">{item.variant.title}</p> : null}
          {item.subscription ? <p className="text-sm text-muted">Subscription</p> : null}
        </div>
        <div className="flex items-center gap-4">
          <label className="sr-only" htmlFor={`qty-${item.id}`}>
            Quantity
          </label>
          <input
            key={item.quantity}
            id={`qty-${item.id}`}
            type="number"
            min={1}
            defaultValue={item.quantity}
            disabled={busy || !variantId}
            onBlur={(event) => {
              const quantity = Math.max(1, Number(event.target.value) || 1);
              if (quantity !== item.quantity) void setQuantity(quantity);
            }}
            className="w-16 rounded-md border border-border px-2 py-1 text-sm"
          />
          <p className="w-24 text-right">{item.line_total_in_currency ?? item.price_in_currency}</p>
          <button type="button" className="text-sm text-muted underline" disabled={busy} onClick={() => void remove()}>
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
    <div className="flex justify-between font-medium">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
