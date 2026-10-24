import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { templateIdFor } from "@/lib/fluid/company";
import { parseLocaleSegment } from "@/lib/fluid/locale";
import { resourcePath, type ResourceRecord, type ResourceType } from "@/lib/fluid/resources";
import { getShop } from "@/lib/fluid/shop";
import { getResource } from "@/lib/fluid/storefront";
import { pageMetadata, type PageSeo } from "@/lib/seo";
import type { TemplateContext } from "@/templates/types";

/**
 * Helpers shared by the routes in `app/[locale]`. A route loads its data,
 * builds its head tags and hands everything to a template; these keep that
 * down to a few lines per route.
 */

/** The shop and the visitor's locale (from the internal `[locale]` segment). */
export async function pageContext(params: Promise<{ locale: string }>): Promise<TemplateContext> {
  const locale = parseLocaleSegment((await params).locale);
  if (!locale) notFound();
  return { shop: await getShop(), locale };
}

export interface LoadedRecord<T extends ResourceType> {
  context: TemplateContext;
  record: ResourceRecord[T];
  /** The Fluid template assigned to the record, or null for the default. */
  templateId: number | null;
  path: string;
}

/** Load the record a `[slug]` route shows, or render the 404 page. */
export async function loadRecord<T extends ResourceType>(
  type: T,
  params: Promise<{ locale: string; slug: string }>,
): Promise<LoadedRecord<T>> {
  const { slug } = await params;
  const context = await pageContext(params);
  const record = await getResource(type, decodeSlug(slug), context.locale);
  if (!record) notFound();

  return {
    context,
    record,
    templateId: await templateIdFor(type, record),
    path: resourcePath(type, record.slug ?? slug),
  };
}

/** Head tags for a `[slug]` route, from the record's Fluid SEO settings. */
export async function recordMetadata<T extends ResourceType>(
  type: T,
  params: Promise<{ locale: string; slug: string }>,
  extra?: (record: ResourceRecord[T]) => Partial<PageSeo>,
): Promise<Metadata> {
  const { slug } = await params;
  const { shop, locale } = await pageContext(params);
  const record = await getResource(type, decodeSlug(slug), locale);
  if (!record) return {};

  return pageMetadata({
    shop,
    locale,
    record,
    path: resourcePath(type, record.slug ?? slug),
    ...extra?.(record),
  });
}

/** Head tags for a page without a record, such as /shop or /blog. */
export async function staticMetadata(
  params: Promise<{ locale: string }>,
  seo: Omit<PageSeo, "shop" | "locale">,
): Promise<Metadata> {
  const { shop, locale } = await pageContext(params);
  return pageMetadata({ shop, locale, ...seo });
}

/** Route params can arrive percent-encoded; decode once, tolerating stray `%`. */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** Read a single string from Next.js search params. */
export function param(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() || undefined;
}
