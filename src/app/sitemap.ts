import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/fluid/config";
import { NO_CREDIT, sitePath } from "@/lib/fluid/routes";
import { resourcePath, type ResourceType } from "@/lib/fluid/resources";
import { getShop } from "@/lib/fluid/shop";
import { listResources } from "@/lib/fluid/storefront";

/** Record types listed in the sitemap. Playlists are left out: they are rep-facing. */
const TYPES: ResourceType[] = ["product", "enrollment_pack", "collection", "category", "post", "page", "medium"];

/** Safety cap per type: 20 pages of 100 records. */
const MAX_PAGES = 20;

/** Built on request (Fluid data is cached) so builds never depend on the Fluid API. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const shop = await getShop();
  const locale = { language: shop.languages[0] ?? "en", country: shop.countries[0] ?? "US" };

  const fixed = ["/", "/shop", "/collections", "/categories", "/blog", "/join"].map((path) => ({
    url: `${base}${sitePath(NO_CREDIT, path)}`,
  }));

  const records = await Promise.all(
    TYPES.map(async (type) => {
      const entries: MetadataRoute.Sitemap = [];
      let cursor: string | null | undefined;
      for (let page = 0; page < MAX_PAGES; page++) {
        const { items, pagination } = await listResources(type, { locale, cursor, limit: 100 });
        for (const item of items) {
          if (!item.slug || item.seo?.indexable === false) continue;
          entries.push({ url: `${base}${sitePath(NO_CREDIT, resourcePath(type, item.slug))}`, lastModified: lastModified(item) });
        }
        cursor = pagination.next_cursor;
        if (!cursor) break;
      }
      return entries;
    }),
  );

  return [...fixed, ...records.flat()];
}

function lastModified(item: object): string | undefined {
  return "updated_at" in item && typeof item.updated_at === "string" ? item.updated_at : undefined;
}
