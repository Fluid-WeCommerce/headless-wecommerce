import type { Metadata } from "next";

import { languageTag, type Locale } from "@/lib/fluid/locale";
import type { ResourceBase, Shop } from "@/lib/fluid/types";

/** Fluid trims meta descriptions to this length. */
const DESCRIPTION_LIMIT = 200;

export interface PageSeo {
  shop: Shop;
  locale: Locale;
  /** Path on this site, without a query string: `/products/beet-blend`. */
  path: string;
  /** The Fluid record the page renders, if any. Its `seo` block wins. */
  record?: ResourceBase | null;
  title?: string;
  description?: string | null;
  image?: string | null;
  type?: "website" | "article";
  /** Extra `<meta>` tags, e.g. Open Graph product price tags. */
  other?: Record<string, string>;
}

/**
 * Head tags for a storefront page, following the rules Fluid's own
 * storefront uses (StorefrontMetaConcern / Themes::SeoResolver):
 *
 * - title: the record's SEO title, then its title, then the shop name,
 *   shown as "Title | Shop" unless it already names the shop
 * - description: SEO description, then the record description without
 *   HTML, cut to 200 characters
 * - image: SEO image, then the record image, then the shop logo
 * - canonical: this site's URL; `?lang=xx` for non-default languages
 * - hreflang: one alternate per language the record is translated into
 * - robots: noindex when Fluid marks the record as not indexable
 */
export function pageMetadata(seo: PageSeo): Metadata {
  const { shop, locale, path, record } = seo;
  const defaultLanguage = shop.languages[0];

  const title = seo.title ?? (record?.seo?.title || record?.title) ?? shop.name;
  const description = truncate(
    stripHtml(seo.description ?? (record?.seo?.description || record?.description) ?? ""),
  );
  const image =
    seo.image ??
    (record?.seo?.image_url || record?.image_url || record?.images?.large?.url) ??
    shop.logoUrl;

  const localized = (language: string) =>
    language === defaultLanguage ? path : `${path}?lang=${encodeURIComponent(language)}`;
  const translations = (record?.languages ?? shop.languages).filter((language) =>
    shop.languages.includes(language),
  );

  return {
    title: title.toLowerCase().includes(shop.name.toLowerCase()) ? { absolute: title } : title,
    description: description || undefined,
    alternates: {
      canonical: localized(locale.language),
      languages:
        translations.length > 1
          ? {
              ...Object.fromEntries(translations.map((language) => [language, localized(language)])),
              "x-default": path,
            }
          : undefined,
    },
    robots: record?.seo?.indexable === false ? { index: false, follow: true } : undefined,
    openGraph: {
      type: seo.type ?? "website",
      title,
      description: description || undefined,
      url: localized(locale.language),
      siteName: shop.name,
      locale: languageTag(locale).replace("-", "_"),
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
    other: seo.other,
  };
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

function truncate(text: string): string {
  if (text.length <= DESCRIPTION_LIMIT) return text;
  return `${text.slice(0, DESCRIPTION_LIMIT - 1).trimEnd()}…`;
}
