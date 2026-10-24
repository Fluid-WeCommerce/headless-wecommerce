/**
 * Typed access to the Fairshare SDK (`@fluid-app/web-widgets` CDN build).
 *
 * The storefront loads the same bundle Fluid-hosted themes load, so
 * tracking, attribution, the cart drawer and checkout behave exactly as
 * they do on Fluid. The bundle exposes itself as `window.FairShareSDK`; the
 * interface below covers the calls this template makes. See the SDK's
 * `packages/fluid/src/index.ts` for the full API.
 */

export const DEFAULT_SDK_URL = "https://assets.fluid.app/scripts/fluid-sdk/latest/web-widgets/index.js";

export interface FairshareConfig {
  /** Company subdomain. */
  fluidShop: string;
  /** Fluid's public API origin. */
  apiEndpoint?: string;
  country?: string;
  language?: string;
  /** Cookie scope; see lib/fluid/cookies.ts. */
  cookieDomain?: string;
  /** Live cart updates over Action Cable. */
  realtimeEnabled?: boolean;
  debug?: boolean;
}

export interface CartLine {
  id: number;
  title?: string;
  quantity: number;
  image_url?: string | null;
  price_in_currency?: string;
  line_total_in_currency?: string;
  subscription?: boolean;
  variant?: { id?: number; title?: string | null; image_url?: string | null } | null;
  product?: { id?: number; image_url?: string | null } | null;
}

export interface Cart {
  cart_token?: string;
  currency_code?: string;
  items?: CartLine[];
  sub_total_in_currency?: string;
  amount_total_in_currency?: string;
  discount_total?: number;
  discount_total_in_currency?: string;
  enrollment_fee_in_currency?: string;
}

export interface AddToCartOptions {
  quantity?: number;
  subscribe?: boolean;
  subscription_plan_id?: number;
}

export interface FairShareSdk {
  initializeFluid(config: FairshareConfig): void;
  getCart(): Promise<Cart | null | undefined>;
  getLocalCart(): Cart | null | undefined;
  onCartChange(handler: (state: { cart: Cart | null }) => void): () => void;
  addCartItems(variantId: number, options?: AddToCartOptions): Promise<Cart | undefined>;
  addEnrollmentPack(enrollmentPackId: number): Promise<Cart | undefined>;
  updateCartItems(items: { variant_id: number; quantity: number }[]): Promise<Cart | undefined>;
  removeCartItemById(itemId: number): Promise<Cart | undefined>;
  /** Hands the cart to Fluid checkout (full-page redirect). */
  checkout(): Promise<void> | void;
  updateLocaleSettings(options: { language?: string; country?: string }): Promise<unknown>;
  openCart(): void;
}

declare global {
  interface Window {
    FairShareSDK?: FairShareSdk;
    FLUID_SDK_INITIALIZED?: boolean;
  }
}

const readyCallbacks = new Set<(sdk: FairShareSdk) => void>();

/** Called by <FairshareProvider> once the SDK is initialized. */
export function markSdkReady(sdk: FairShareSdk) {
  for (const callback of readyCallbacks) callback(sdk);
  readyCallbacks.clear();
}

/** Resolves with the SDK once it has loaded and been initialized. */
export function whenSdkReady(): Promise<FairShareSdk> {
  if (typeof window !== "undefined" && window.FLUID_SDK_INITIALIZED && window.FairShareSDK) {
    return Promise.resolve(window.FairShareSDK);
  }
  return new Promise((resolve) => readyCallbacks.add(resolve));
}
