import { describe, expect, it } from "vitest";

import { parseStorefrontPath, sitePath, toSitePath } from "./routes";

describe("parseStorefrontPath", () => {
  it("passes storefront paths through", () => {
    expect(parseStorefrontPath("/products/beet-blend")).toEqual({ pathname: "/products/beet-blend", credit: null, legacy: false });
    expect(parseStorefrontPath("/")).toEqual({ pathname: "/", credit: null, legacy: false });
  });

  it("strips a rep's username from the credit slot", () => {
    expect(parseStorefrontPath("/jane/products/beet-blend")).toEqual({
      pathname: "/products/beet-blend",
      credit: "jane",
      legacy: false,
    });
    expect(parseStorefrontPath("/jane")).toEqual({ pathname: "/", credit: "jane", legacy: false });
    expect(parseStorefrontPath("/my/jane")).toEqual({ pathname: "/", credit: "jane", legacy: false });
  });

  it("treats Fluid's `home` credit as no rep", () => {
    expect(parseStorefrontPath("/home/blog/hello")).toEqual({ pathname: "/blog/hello", credit: null, legacy: false });
  });

  it("does not mistake a deep unknown path for a credit", () => {
    expect(parseStorefrontPath("/about/team").pathname).toBe("/about/team");
  });

  it("flags legacy Fluid paths for redirect", () => {
    expect(parseStorefrontPath("/jane/posts/hello")).toEqual({ pathname: "/blog/hello", credit: "jane", legacy: true });
    expect(parseStorefrontPath("/shop/beet-blend")).toEqual({ pathname: "/products/beet-blend", credit: null, legacy: true });
    expect(parseStorefrontPath("/library/kit").pathname).toBe("/libraries/kit");
    expect(parseStorefrontPath("/shop").legacy).toBe(false);
  });
});

describe("toSitePath", () => {
  const storefront = "https://acme.fluid.app";

  it("maps Fluid storefront links onto this site", () => {
    expect(toSitePath("https://acme.fluid.app/home/products/beet-blend", storefront)).toBe("/products/beet-blend");
    expect(toSitePath("/home/collections/summer?x=1", storefront)).toBe("/collections/summer?x=1");
  });

  it("leaves external links alone", () => {
    expect(toSitePath("https://instagram.com/acme", storefront)).toBe("https://instagram.com/acme");
    expect(toSitePath("https://checkout.fluid.app/checkouts/abc", storefront)).toBe("https://checkout.fluid.app/checkouts/abc");
  });
});

describe("sitePath", () => {
  it("puts paths under the visitor's credit, or home without a rep", () => {
    expect(sitePath("jane", "/shop")).toBe("/jane/shop");
    expect(sitePath("jane", "/collections/summer?cursor=abc#top")).toBe("/jane/collections/summer?cursor=abc#top");
    expect(sitePath(null, "/categories")).toBe("/home/categories");
    expect(sitePath("jane", "/")).toBe("/jane");
  });

  it("replaces a credit already in the path", () => {
    expect(sitePath("jane", "/home/shop")).toBe("/jane/shop");
    expect(sitePath("home", "/bob/products/kit")).toBe("/home/products/kit");
  });

  it("leaves external and non-path links alone", () => {
    expect(sitePath("jane", "https://example.com/shop")).toBe("https://example.com/shop");
    expect(sitePath("jane", "//cdn.example.com/a.pdf")).toBe("//cdn.example.com/a.pdf");
    expect(sitePath("jane", "#reviews")).toBe("#reviews");
  });
});
