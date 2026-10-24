import "server-only";

import { fallbackNavigation, menus as menuSlugs, type NavLink } from "@/config/site";

import { fluidConfig } from "./config";
import { FluidApiError, fluidRequest } from "./http";
import { RESOURCES, type ResourceRecord, type ResourceType } from "./resources";
import { toSitePath } from "./routes";
import type { Menu, MenuItem } from "./types";

/**
 * Reads that need the company's private token (`FLUID_COMPANY_PRIVATE_TOKEN`,
 * injected into every Mist app). Each one degrades gracefully without it, so
 * the storefront works with nothing but a subdomain.
 */

/**
 * The Fluid theme template chosen for a record in Fluid admin, or `null`
 * for "use the default". The public API is gaining this field; until then
 * it is read from the company API when a private token is configured.
 */
export async function templateIdFor<T extends ResourceType>(
  type: T,
  record: ResourceRecord[T],
): Promise<number | null> {
  if (record.application_theme_template_id !== undefined) {
    return record.application_theme_template_id;
  }

  const { privateToken, storefrontUrl } = fluidConfig();
  if (!privateToken) return null;

  const { api, item } = RESOURCES[type];
  try {
    const body = await fluidRequest<Record<string, { application_theme_template_id?: number | null }>>(
      `${storefrontUrl}/api/v202604/company/${api}/${record.id}`,
      { token: privateToken, tags: [`fluid:${type}`, `fluid:${type}:${record.slug}`] },
    );
    return body?.[item]?.application_theme_template_id ?? null;
  } catch (error) {
    warn(`template for ${type} ${record.id}`, error);
    return null;
  }
}

/** Header and footer links from Fluid menus, or the fallbacks in config/site.ts. */
export async function getNavigation(): Promise<{ header: NavLink[]; footer: NavLink[] }> {
  const { privateToken, storefrontUrl } = fluidConfig();
  if (!privateToken) return fallbackNavigation;

  let menus: Menu[];
  try {
    const body = await fluidRequest<{ menus?: Menu[] }>(`${storefrontUrl}/api/menus`, {
      token: privateToken,
      query: { per_page: 100 },
      tags: ["fluid:menus"],
    });
    menus = body?.menus ?? [];
  } catch (error) {
    warn("menus", error);
    return fallbackNavigation;
  }

  const links = (slug: string) => {
    const menu = menus.find((candidate) => candidate.slug === slug && candidate.active);
    return menu ? toNavLinks(menu.menu_items, storefrontUrl) : null;
  };

  return {
    header: links(menuSlugs.header) ?? fallbackNavigation.header,
    footer: links(menuSlugs.footer) ?? fallbackNavigation.footer,
  };
}

function toNavLinks(items: MenuItem[], storefrontUrl: string): NavLink[] {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      title: item.title,
      href: toSitePath(item.url, storefrontUrl),
      children: item.sub_menu_items?.length ? toNavLinks(item.sub_menu_items, storefrontUrl) : undefined,
    }));
}

function warn(what: string, error: unknown) {
  const detail = error instanceof FluidApiError ? `HTTP ${error.status}` : String(error);
  console.warn(`[fluid] Could not load ${what} with FLUID_COMPANY_PRIVATE_TOKEN (${detail}); using defaults.`);
}
