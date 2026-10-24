"use client";

import { useId, useState } from "react";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { displayPrice, formatMoney } from "@/components/Price";
import type { Product, ProductVariant } from "@/lib/fluid/types";

/**
 * Variant, purchase type and quantity selection for a product page. Prices
 * come from the variant's entry for the visitor's country.
 */
export function ProductForm({ product, country }: { product: Product; country: string }) {
  const id = useId();
  const variants = product.variants.length ? product.variants : [];
  const [variantId, setVariantId] = useState(initialVariantId(product));
  const [subscribe, setSubscribe] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const variant = variants.find((candidate) => candidate.id === variantId);
  const pricing = variant?.variant_countries?.[country];
  const plans = product.subscription_plans.filter((plan) => plan.active);
  const defaultPlan = plans.find((plan) => plan.default) ?? plans[0];
  const canSubscribe = Boolean(defaultPlan) && variant?.allow_subscription !== false;
  const subscriptionOnly = variant?.subscription_only === true;
  const subscribed = canSubscribe && (subscribe || subscriptionOnly);
  const purchasable = product.in_stock && pricing?.buyable !== false && isInStock(variant);

  const oneTimePrice = pricing?.display_price ?? product.pricing?.display_price;
  const subscriptionPrice = pricing?.subscription_price ? formatMoney(pricing.subscription_price, pricing.currency_code) : null;
  const compareAt =
    pricing?.compare_price && Number(pricing.compare_price) > Number(pricing.price)
      ? formatMoney(pricing.compare_price, pricing.currency_code)
      : null;
  const shownPrice = subscribed && subscriptionPrice ? subscriptionPrice : oneTimePrice ? displayPrice(oneTimePrice) : null;
  const plan = defaultPlan?.subscription_plan;

  return (
    <div className="mt-5 space-y-8">
      {shownPrice ? (
        <p className="flex items-baseline gap-3 text-2xl">
          <span>{shownPrice}</span>
          {compareAt && !subscribed ? <s className="text-lg text-muted">{compareAt}</s> : null}
        </p>
      ) : null}

      {variants.length > 1 ? (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">
            Option: <span className="font-normal text-muted">{variant ? variantLabel(variant) : ""}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((option) => (
              <label
                key={option.id}
                className="cursor-pointer rounded-sm border border-border px-4 py-2.5 text-[15px] transition-colors hover:border-foreground has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
              >
                <input
                  type="radio"
                  name={`${id}-variant`}
                  value={option.id}
                  checked={option.id === variantId}
                  onChange={() => setVariantId(option.id)}
                  className="sr-only"
                />
                {variantLabel(option)}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {canSubscribe && !subscriptionOnly ? (
        <fieldset className="space-y-3">
          <legend className="mb-3 text-sm font-medium">Purchase</legend>
          <PurchaseOption name={`${id}-purchase`} checked={!subscribe} onSelect={() => setSubscribe(false)} title="One-time purchase" price={oneTimePrice ? displayPrice(oneTimePrice) : null} />
          <PurchaseOption
            name={`${id}-purchase`}
            checked={subscribe}
            onSelect={() => setSubscribe(true)}
            title={plan?.savings_label ? `Subscribe & ${plan.savings_label.toLowerCase()}` : "Subscribe"}
            detail={plan?.billing_frequency_in_words ? `Delivered ${plan.billing_frequency_in_words}` : undefined}
            price={subscriptionPrice}
          />
        </fieldset>
      ) : null}

      <div className="flex gap-3">
        <div className="flex h-12 items-center rounded-sm border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex h-full w-11 items-center justify-center disabled:opacity-30"
          >
            <MinusIcon width={16} height={16} />
          </button>
          <label htmlFor={`${id}-quantity`} className="sr-only">
            Quantity
          </label>
          <input
            id={`${id}-quantity`}
            type="number"
            inputMode="numeric"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="h-full w-10 bg-transparent text-center text-[15px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((value) => value + 1)}
            className="flex h-full w-11 items-center justify-center"
          >
            <PlusIcon width={16} height={16} />
          </button>
        </div>
        <AddToCartButton
          className="flex-1"
          variantId={variant?.id}
          disabled={!purchasable}
          options={{
            quantity,
            subscribe: subscribed,
            subscription_plan_id: subscribed ? plan?.id : undefined,
          }}
        >
          {purchasable ? "Add to cart" : "Sold out"}
        </AddToCartButton>
      </div>
    </div>
  );
}

function PurchaseOption({
  name,
  checked,
  onSelect,
  title,
  detail,
  price,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail?: string;
  price: string | null;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-sm border border-border px-4 py-4 transition-colors hover:border-foreground has-checked:border-foreground has-checked:ring-1 has-checked:ring-foreground">
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="size-4 accent-foreground" />
      <span className="flex-1">
        <span className="block text-[15px] font-medium">{title}</span>
        {detail ? <span className="block text-sm text-muted">{detail}</span> : null}
      </span>
      {price ? <span className="text-[15px]">{price}</span> : null}
    </label>
  );
}

function initialVariantId(product: Product): number | undefined {
  return (
    product.default_variant?.id ??
    product.variants.find((variant) => variant.is_master)?.id ??
    product.variants[0]?.id
  );
}

function variantLabel(variant: ProductVariant): string {
  return variant.option_attrs?.length ? variant.option_attrs.join(" / ") : (variant.title ?? `Option ${variant.id}`);
}

function isInStock(variant: ProductVariant | undefined): boolean {
  if (!variant?.track_quantity || variant.keep_selling) return true;
  return (variant.inventory_quantity ?? 0) > 0;
}
