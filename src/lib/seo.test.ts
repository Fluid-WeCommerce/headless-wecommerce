import { describe, expect, it } from "vitest";

import { pageMetadata } from "./seo";
import type { ResourceBase, Shop } from "./fluid/types";

const shop: Shop = {
  name: "Acme",
  primaryColor: null,
  secondaryColor: null,
  logoUrl: "https://cdn.fluid.app/logo.png",
  iconUrl: null,
  countries: ["US"],
  languages: ["en", "es"],
};

const record: ResourceBase = {
  id: 1,
  slug: "beet-blend",
  title: "Beet Blend",
  description: "<p>Cold-pressed &amp; <strong>fresh</strong>.</p>",
  canonical_url: "https://acme.fluid.app/home/products/beet-blend",
  images: { large: { url: "https://ik.imagekit.io/large.png", width: 1200 } },
  active: true,
  status: "published",
  languages: ["en", "es"],
};

describe("pageMetadata", () => {
  it("falls back from SEO fields to the record and strips HTML", () => {
    const metadata = pageMetadata({ shop, locale: { language: "en", country: "US" }, path: "/products/beet-blend", record });
    expect(metadata.title).toBe("Beet Blend");
    expect(metadata.description).toBe("Cold-pressed & fresh.");
    expect(metadata.openGraph?.images).toEqual([{ url: "https://ik.imagekit.io/large.png", width: 1200, height: 630, alt: "Beet Blend" }]);
  });

  it("prefers the record's SEO block and honours noindex", () => {
    const metadata = pageMetadata({
      shop,
      locale: { language: "en", country: "US" },
      path: "/products/beet-blend",
      record: { ...record, seo: { title: "Acme Beet Blend", description: "SEO copy", image_url: "https://seo.png", indexable: false } },
    });
    expect(metadata.title).toEqual({ absolute: "Acme Beet Blend" });
    expect(metadata.description).toBe("SEO copy");
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("emits hreflang alternates and a self-referencing canonical", () => {
    const metadata = pageMetadata({ shop, locale: { language: "es", country: "US" }, path: "/products/beet-blend", record });
    expect(metadata.alternates).toEqual({
      canonical: "/home/products/beet-blend?lang=es",
      languages: {
        en: "/home/products/beet-blend",
        es: "/home/products/beet-blend?lang=es",
        "x-default": "/home/products/beet-blend",
      },
    });
  });
});
