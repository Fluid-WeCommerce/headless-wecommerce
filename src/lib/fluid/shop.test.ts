import { describe, expect, it, vi } from "vitest";

import { getShop, hexColor } from "./shop";

describe("hexColor", () => {
  it("accepts Fluid's bare hex and CSS hex", () => {
    expect(hexColor("3A327F")).toBe("#3a327f");
    expect(hexColor("#fff")).toBe("#fff");
  });

  it("rejects anything that is not a hex color", () => {
    expect(hexColor("red; background: url(x)")).toBeNull();
    expect(hexColor(null)).toBeNull();
  });
});

describe("getShop", () => {
  it("falls back to defaults when Fluid refuses the request", async () => {
    vi.stubEnv("FLUID_SHOP", "acme");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetch = vi.fn(async () => new Response("Too Many Requests", { status: 429 }));
    vi.stubGlobal("fetch", fetch);

    await expect(getShop()).resolves.toMatchObject({ name: "acme", languages: ["en"], countries: ["US"] });
    // The cached session, then one retry with a fresh one.
    expect(fetch).toHaveBeenCalledTimes(2);

    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });
});
