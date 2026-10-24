"use client";

import type { ReactNode } from "react";

import { useSdkAction } from "@/lib/fairshare/hooks";
import type { AddToCartOptions } from "@/lib/fairshare/sdk";

import { Button } from "../Button";

/** Adds a variant to the Fluid cart through the Fairshare SDK, which opens the cart drawer. */
export function AddToCartButton({
  variantId,
  options,
  disabled,
  children = "Add to cart",
  className,
}: {
  variantId: number | null | undefined;
  options?: AddToCartOptions;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const [add, adding] = useSdkAction((sdk) => (variantId ? sdk.addCartItems(variantId, options) : undefined));

  return (
    <Button className={className} disabled={disabled || !variantId || adding} onClick={() => void add()}>
      {adding ? "Adding…" : children}
    </Button>
  );
}
