import { cache } from "react";

import { fluidConfig } from "./config";
import { fluidRequest } from "./http";
import type { Shop } from "./types";

interface SettingsResponse {
  settings?: {
    shop?: {
      name?: string;
      primary_color?: string | null;
      secondary_color?: string | null;
      logo_url?: string | null;
      icon_url?: string | null;
      countries?: string[];
      languages?: string[];
    };
  };
}

/**
 * The company's brand plus the languages and countries it sells in, from
 * Fluid's public settings endpoint (the one the Fairshare SDK calls).
 *
 * The request carries no page URL on purpose: Fluid records a page visit
 * only when one is sent, and the SDK already reports real visits from the
 * browser. Sending one from the server would count every render.
 *
 * If Fluid can't be reached or refuses the request (an expired session, a
 * rate limit), it retries once with a fresh session, then falls back to
 * defaults so pages still render rather than failing.
 *
 * `revalidate: false` skips the Next.js data cache; the proxy uses it
 * because it runs outside of rendering and keeps its own copy. Within a
 * render, every caller shares one result.
 */
export const getShop = cache(async (options: { revalidate?: number | false } = {}): Promise<Shop> => {
  const memoryOnly = options.revalidate === false;
  try {
    return await loadShop(await serverSession(memoryOnly), options.revalidate);
  } catch {
    // The cached session may have expired; try once with a new one.
    if (memoryOnly) memorySession = undefined;
    try {
      return await loadShop(await openSession(false), options.revalidate);
    } catch (error) {
      console.error(`[fluid] Could not load settings for shop "${fluidConfig().shop}"; using defaults.`, error);
      return fallbackShop();
    }
  }
});

async function loadShop(session: string, revalidate: number | false | undefined): Promise<Shop> {
  const { apiUrl, shop } = fluidConfig();
  const body = await fluidRequest<SettingsResponse>(`${apiUrl}/api/public/v2025-06/settings`, {
    method: "POST",
    body: {
      metadata: { fluid_shop: shop, fluid_session: session },
      page: { title: "headless storefront" },
    },
    tags: ["fluid:shop"],
    revalidate,
  });

  const settings = body?.settings?.shop;
  if (!settings) {
    throw new Error(`Fluid returned no settings for shop "${shop}". Check FLUID_SHOP / FLUID_BASE_URL.`);
  }

  return {
    name: settings.name ?? shop,
    primaryColor: hexColor(settings.primary_color),
    secondaryColor: hexColor(settings.secondary_color),
    logoUrl: settings.logo_url ?? null,
    iconUrl: settings.icon_url ?? null,
    countries: settings.countries?.length ? settings.countries : ["US"],
    languages: settings.languages?.length ? settings.languages : ["en"],
  };
}

/** What the storefront shows when Fluid's settings can't be loaded. */
function fallbackShop(): Shop {
  return {
    name: fluidConfig().shop,
    primaryColor: null,
    secondaryColor: null,
    logoUrl: null,
    iconUrl: null,
    countries: ["US"],
    languages: ["en"],
  };
}

/** Fluid stores colors as bare hex (`3A327F`); returns `#3a327f`, or null if it isn't one. */
export function hexColor(value: string | null | undefined): string | null {
  const hex = value?.trim().replace(/^#/, "");
  return hex && /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex) ? `#${hex.toLowerCase()}` : null;
}

let memorySession: Promise<string> | undefined;

/**
 * The settings endpoint requires a Fairshare session. The server opens one
 * and keeps reusing it (cached for the life of the deployment, or of the
 * process for the proxy) rather than opening a session per request.
 */
function serverSession(memoryOnly: boolean): Promise<string> {
  if (memoryOnly) {
    memorySession ??= openSession(false).catch((error: unknown) => {
      memorySession = undefined;
      throw error;
    });
    return memorySession;
  }
  return openSession(ONE_YEAR);
}

const ONE_YEAR = 60 * 60 * 24 * 365;

async function openSession(revalidate: number | false): Promise<string> {
  const { apiUrl, shop } = fluidConfig();
  const body = await fluidRequest<{ fluid_session?: string }>(`${apiUrl}/api/public/v2025-06/session`, {
    method: "POST",
    body: { fluid_shop: shop },
    tags: ["fluid:session"],
    revalidate,
  });
  if (!body?.fluid_session) throw new Error(`Fluid did not open a session for shop "${shop}".`);
  return body.fluid_session;
}
