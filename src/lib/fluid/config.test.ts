import { describe, expect, it } from "vitest";

import { readFluidConfig, siteUrl } from "./config";

describe("readFluidConfig", () => {
  it("derives everything from FLUID_SHOP", () => {
    expect(readFluidConfig({ FLUID_SHOP: "Acme" })).toEqual({
      shop: "acme",
      storefrontUrl: "https://acme.fluid.app",
      apiUrl: "https://api.fluid.app",
      privateToken: undefined,
    });
  });

  it("reads the variables Fluid injects into Mist apps", () => {
    expect(
      readFluidConfig({ FLUID_BASE_URL: "https://acme.fluid.app/", FLUID_COMPANY_PRIVATE_TOKEN: "PT-secret" }),
    ).toMatchObject({ shop: "acme", storefrontUrl: "https://acme.fluid.app", privateToken: "PT-secret" });
  });

  it("explains what to set when unconfigured", () => {
    expect(() => readFluidConfig({})).toThrow(/FLUID_SHOP/);
  });
});

describe("siteUrl", () => {
  it("uses the Vercel production domain in production", () => {
    expect(siteUrl({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "shop.acme.com", VERCEL_URL: "x.vercel.app" })).toBe(
      "https://shop.acme.com",
    );
  });

  it("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://acme.com/", VERCEL_URL: "x.vercel.app" })).toBe("https://acme.com");
  });
});
