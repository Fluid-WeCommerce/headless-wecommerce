"use client";

import { useCallback, useEffect, useState } from "react";

import { whenSdkReady, type Cart, type FairShareSdk } from "./sdk";

/** The visitor's cart, kept in sync with the SDK and the Fluid cart drawer. */
export function useCart(): { cart: Cart | null; loading: boolean } {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void whenSdkReady().then(async (sdk) => {
      if (cancelled) return;
      setCart(sdk.getLocalCart() ?? null);
      unsubscribe = sdk.onCartChange((state) => setCart(state.cart));
      try {
        const fresh = await sdk.getCart();
        if (!cancelled) setCart(fresh ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return { cart, loading };
}

/**
 * Run an SDK call from an event handler, tracking whether it is in flight.
 *
 *   const [addToCart, adding] = useSdkAction((sdk) => sdk.addCartItems(variantId));
 */
export function useSdkAction<Args extends unknown[]>(
  action: (sdk: FairShareSdk, ...args: Args) => Promise<unknown> | unknown,
): [(...args: Args) => Promise<void>, boolean] {
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async (...args: Args) => {
      setPending(true);
      try {
        await action(await whenSdkReady(), ...args);
      } finally {
        setPending(false);
      }
    },
    [action],
  );

  return [run, pending];
}

export function cartItemCount(cart: Cart | null): number {
  return cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
}
