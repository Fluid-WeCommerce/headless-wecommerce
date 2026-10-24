import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { normalizeRecord } = await import("./storefront");

describe("normalizeRecord", () => {
  it("flattens rich-text descriptions to their HTML body", () => {
    expect(normalizeRecord({ id: 1, description: { id: 9, name: "description", body: "<p>Hi</p>" } })).toEqual({
      id: 1,
      description: "<p>Hi</p>",
    });
  });

  it("leaves string and missing descriptions alone", () => {
    expect(normalizeRecord({ id: 1, description: "Plain" })).toEqual({ id: 1, description: "Plain" });
    expect(normalizeRecord({ id: 1, description: null })).toEqual({ id: 1, description: null });
  });
});

describe("getLibraryItems", () => {
  it("loads items by slug in playlist order and skips ones it cannot show", async () => {
    vi.stubEnv("FLUID_SHOP", "acme");
    const fetch = vi.fn(async (url: string) => {
      const { pathname } = new URL(url);
      if (pathname.endsWith("/media/intro")) return Response.json({ medium: { id: 1, slug: "intro", title: "Intro" } });
      if (pathname.endsWith("/products/kit")) return Response.json({ product: { id: 2, slug: "kit", title: "Kit" } });
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetch);
    const { getLibraryItems } = await import("./storefront");

    const items = await getLibraryItems(
      {
        library_items: [
          { id: 12, relateable_type: "Product", relateable_id: 2, relateable_slug: "kit", order: 2 },
          { id: 11, relateable_type: "Medium", relateable_id: 1, relateable_slug: "intro", order: 1 },
          { id: 13, relateable_type: "Medium", relateable_id: 3, order: 3 },
          { id: 14, relateable_type: "Promotion", relateable_id: 4, relateable_slug: "sale", order: 4 },
          { id: 15, relateable_type: "Product", relateable_id: 5, relateable_slug: "hidden", order: 5 },
        ],
      } as Parameters<typeof getLibraryItems>[0],
      { language: "en", country: "US" },
    );

    expect(items.map(({ type, record }) => [type, record.slug])).toEqual([
      ["medium", "intro"],
      ["product", "kit"],
    ]);
    expect(fetch).toHaveBeenCalledTimes(3);
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
});
