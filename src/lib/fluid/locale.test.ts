import { describe, expect, it } from "vitest";

import { acceptedLanguages, localeSegment, parseLocaleSegment, resolveLocale } from "./locale";

const market = { languages: ["en", "es", "fr"], countries: ["US", "MX", "CA"] };

describe("resolveLocale", () => {
  it("falls back to the company defaults", () => {
    expect(resolveLocale({}, market)).toEqual({ language: "en", country: "US" });
  });

  it("prefers query params over cookies, browser and geo", () => {
    expect(
      resolveLocale(
        {
          queryLanguage: "es",
          queryCountry: "mx",
          fluidLocaleCookie: "fr_CA",
          acceptLanguage: "fr-CA,fr;q=0.9",
          geoCountry: "CA",
        },
        market,
      ),
    ).toEqual({ language: "es", country: "MX" });
  });

  it("reads the fluid_locale cookie Fluid and the SDK write", () => {
    expect(resolveLocale({ fluidLocaleCookie: "fr_CA" }, market)).toEqual({ language: "fr", country: "CA" });
  });

  it("uses the browser language and edge country on a first visit", () => {
    expect(resolveLocale({ acceptLanguage: "de-DE,es;q=0.8", geoCountry: "MX" }, market)).toEqual({
      language: "es",
      country: "MX",
    });
  });

  it("ignores languages and countries the company does not sell in", () => {
    expect(resolveLocale({ queryLanguage: "ja", queryCountry: "JP", fluidLocaleCookie: "de_DE" }, market)).toEqual({
      language: "en",
      country: "US",
    });
  });
});

describe("region-specific languages", () => {
  const withChinese = { languages: ["en", "zh", "zh-TW"], countries: ["US", "TW"] };

  it("matches a language with a region exactly, then by its primary subtag", () => {
    expect(resolveLocale({ acceptLanguage: "zh-tw,zh;q=0.9" }, withChinese).language).toBe("zh-TW");
    expect(resolveLocale({ acceptLanguage: "zh-CN" }, withChinese).language).toBe("zh");
    expect(resolveLocale({ fluidLocaleCookie: "zh-TW_TW" }, withChinese)).toEqual({ language: "zh-TW", country: "TW" });
  });
});

describe("acceptedLanguages", () => {
  it("orders by weight and drops wildcards and zero weights", () => {
    expect(acceptedLanguages("fr;q=0.5, en-US, *;q=0.1, es;q=0")).toEqual(["en-us", "fr"]);
  });
});

describe("locale segment", () => {
  it("round-trips", () => {
    expect(parseLocaleSegment(localeSegment({ language: "es", country: "MX" }))).toEqual({ language: "es", country: "MX" });
  });

  it("uses the fluid_locale format, including region-specific languages", () => {
    expect(localeSegment({ language: "en", country: "US" })).toBe("en_US");
    expect(parseLocaleSegment("zh-TW_TW")).toEqual({ language: "zh-TW", country: "TW" });
  });

  it("rejects anything else", () => {
    expect(parseLocaleSegment("products")).toBeNull();
    expect(parseLocaleSegment("en-US")).toBeNull();
  });
});
