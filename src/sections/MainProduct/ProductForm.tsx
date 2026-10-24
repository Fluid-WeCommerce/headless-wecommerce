"use client";

import { useId, useState } from "react";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatMoney } from "@/components/Price";
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

  return (
    <div className="space-y-6">
      <p className="text-2xl">
        {subscribed && pricing?.subscription_price
          ? formatMoney(pricing.subscription_price, pricing.currency_code)
          : (pricing?.display_price ?? product.pricing?.display_price)}
      </p>

      {variants.length > 1 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Options</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((option) => (
              <label
                key={option.id}
                className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm has-checked:border-brand has-checked:bg-brand has-checked:text-white"
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
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium">Purchase</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name={`${id}-purchase`} checked={!subscribe} onChange={() => setSubscribe(false)} />
            One-time purchase
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name={`${id}-purchase`} checked={subscribe} onChange={() => setSubscribe(true)} />
            {defaultPlan?.subscription_plan.savings_label ||
              `Subscribe${defaultPlan?.subscription_plan.billing_frequency_in_words ? ` · ${defaultPlan.subscription_plan.billing_frequency_in_words}` : ""}`}
          </label>
        </fieldset>
      ) : null}

      <div className="flex items-center gap-3">
        <label htmlFor={`${id}-quantity`} className="sr-only">
          Quantity
        </label>
        <input
          id={`${id}-quantity`}
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="w-20 rounded-full border border-border px-4 py-3 text-sm"
        />
        <AddToCartButton
          className="flex-1"
          variantId={variant?.id}
          disabled={!purchasable}
          options={{
            quantity,
            subscribe: subscribed,
            subscription_plan_id: subscribed ? defaultPlan?.subscription_plan.id : undefined,
          }}
        >
          {purchasable ? "Add to cart" : "Sold out"}
        </AddToCartButton>
      </div>
    </div>
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
