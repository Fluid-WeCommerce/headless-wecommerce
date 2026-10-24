import { stripHtml } from "@/lib/seo";
import type { Post, Product, Shop } from "@/lib/fluid/types";

/** schema.org JSON-LD, rendered by <JsonLd>. */
export type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(shop: Shop, siteUrl: string): JsonLdObject[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: shop.name,
      url: siteUrl,
      logo: shop.logoUrl ?? undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: shop.name,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function productJsonLd(product: Product, url: string, shop: Shop): JsonLdObject {
  const pricing = product.pricing;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ? stripHtml(product.description) : undefined,
    image: [product.images?.large?.url ?? product.image_url].filter(Boolean),
    sku: product.sku ?? undefined,
    brand: { "@type": "Brand", name: shop.name },
    offers:
      pricing?.price && pricing.currency_code
        ? {
            "@type": "Offer",
            url,
            price: pricing.price,
            priceCurrency: pricing.currency_code,
            availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          }
        : undefined,
  };
}

export function articleJsonLd(post: Post, url: string, shop: Shop): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary ?? undefined,
    image: post.images?.large?.url ?? post.image_url ?? undefined,
    datePublished: post.post_date ?? undefined,
    author: post.post_author ? { "@type": "Person", name: post.post_author } : undefined,
    publisher: { "@type": "Organization", name: shop.name, logo: shop.logoUrl ?? undefined },
    mainEntityOfPage: url,
  };
}
