/**
 * Environment configuration for talking to Fluid.
 *
 * A Fluid Mist app gets `FLUID_BASE_URL` and the company tokens injected
 * automatically. Anywhere else (Vercel, your own server) set `FLUID_SHOP`
 * to the company subdomain and everything else is derived from it.
 */

export interface FluidConfig {
  /** Company subdomain, e.g. `acme` for acme.fluid.app. */
  shop: string;
  /** Origin of the company's Fluid storefront, e.g. `https://acme.fluid.app`. */
  storefrontUrl: string;
  /** Origin of Fluid's public API, used by the settings endpoint and the SDK. */
  apiUrl: string;
  /**
   * Optional server-only company token (`PT-…`). Unlocks navigation menus.
   * Never expose it to the browser.
   */
  privateToken: string | undefined;
}

type Env = Record<string, string | undefined>;

const FLUID_PLATFORM_HOST = /^([a-z0-9-]+)\.fluid\.app$/i;

let cached: FluidConfig | undefined;

export function fluidConfig(): FluidConfig {
  cached ??= readFluidConfig(process.env);
  return cached;
}

export function readFluidConfig(env: Env): FluidConfig {
  const baseUrl = env.FLUID_BASE_URL?.trim();
  const explicitShop = env.FLUID_SHOP?.trim().toLowerCase() || undefined;

  let storefrontUrl: string;
  let shop: string | undefined = explicitShop;

  if (baseUrl) {
    const url = new URL(baseUrl);
    storefrontUrl = url.origin;
    shop ??= url.hostname.match(FLUID_PLATFORM_HOST)?.[1];
  } else if (explicitShop) {
    storefrontUrl = `https://${explicitShop}.fluid.app`;
  } else {
    throw new Error(
      "Fluid is not configured. Set FLUID_SHOP to your company subdomain (e.g. FLUID_SHOP=acme), " +
        "or FLUID_BASE_URL to your Fluid storefront URL. See .env.example.",
    );
  }

  if (!shop) {
    throw new Error(
      `Could not derive the company subdomain from FLUID_BASE_URL (${baseUrl}). Set FLUID_SHOP as well.`,
    );
  }

  return {
    shop: shop.toLowerCase(),
    storefrontUrl,
    apiUrl: new URL(env.FLUID_API_URL?.trim() || "https://api.fluid.app").origin,
    privateToken: env.FLUID_COMPANY_PRIVATE_TOKEN?.trim() || undefined,
  };
}

/**
 * The public origin of this storefront, used for canonical URLs, sitemaps
 * and Open Graph tags. On Vercel the production domain (including a custom
 * domain attached to the project) is picked up automatically.
 */
export function siteUrl(env: Env = process.env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim() || env.SITE_URL?.trim();
  if (explicit) return new URL(explicit).origin;

  const vercelHost =
    env.VERCEL_ENV === "production" ? env.VERCEL_PROJECT_PRODUCTION_URL : env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return `http://localhost:${env.PORT ?? 3000}`;
}
