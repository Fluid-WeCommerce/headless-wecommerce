/**
 * Language and country handling, matching Fluid's own storefront.
 *
 * Fluid keeps URLs locale-free (`/products/beet-blend`) and carries the
 * visitor's choice in a `fluid_locale=<lang>_<COUNTRY>` cookie, which the
 * Fairshare SDK and checkout read too. `?lang=es` and `?country=MX` switch
 * it. The proxy resolves a locale for every request and rewrites to an
 * internal `/[locale]` segment in the same format (e.g. `/en_US/products/...`)
 * so each language/country pair is cached separately; that segment never
 * appears in a public URL.
 */

export interface Locale {
  /** Language code as Fluid stores it: `en`, or with a region, `zh-TW`. */
  language: string;
  /** ISO 3166-1 alpha-2 country code, uppercase: `US`. */
  country: string;
}

export interface LocaleMarket {
  /** Languages the company sells in, default first. */
  languages: readonly string[];
  /** Countries the company sells in, default first. */
  countries: readonly string[];
}

/** Every signal the proxy can see, strongest first within each field. */
export interface LocaleSignals {
  queryLanguage?: string | null;
  queryCountry?: string | null;
  /** Raw `fluid_locale` cookie, e.g. `es_MX`. */
  fluidLocaleCookie?: string | null;
  fluidLanguageCookie?: string | null;
  fluidCountryCookie?: string | null;
  acceptLanguage?: string | null;
  /** Country from the edge, e.g. Vercel's `x-vercel-ip-country`. */
  geoCountry?: string | null;
}

export const LOCALE_COOKIES = {
  locale: "fluid_locale",
  language: "fluid_language",
  country: "fluid_country",
} as const;

const FLUID_LOCALE = /^([a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*)_([A-Z]{2})$/;

/** The `fluid_locale` cookie value Fluid, the SDK and checkout share: `en_US`. */
export function fluidLocaleValue(locale: Locale): string {
  return `${locale.language}_${locale.country}`;
}

/** The internal route segment for a locale; the same format as the cookie. */
export const localeSegment = fluidLocaleValue;

export function parseLocaleSegment(segment: string): Locale | null {
  const match = FLUID_LOCALE.exec(decodeURIComponent(segment));
  return match ? { language: match[1]!, country: match[2]! } : null;
}

export function parseFluidLocale(value: string | null | undefined): Partial<Locale> {
  const [language, country] = (value ?? "").split("_", 2);
  return { language: language || undefined, country: country || undefined };
}

/** BCP 47 tag for `<html lang>` and `Intl`: `en-US`, or `zh-TW` as is. */
export function languageTag(locale: Locale): string {
  return locale.language.includes("-") ? locale.language : `${locale.language}-${locale.country}`;
}

/**
 * Pick the visitor's locale from the signals, keeping only values the
 * company actually supports. Mirrors Fluid's LocaleResolver: explicit query
 * params, then cookies, then the browser and edge geo, then the default.
 */
export function resolveLocale(signals: LocaleSignals, market: LocaleMarket): Locale {
  const cookie = parseFluidLocale(signals.fluidLocaleCookie);

  const language =
    firstMatch(market.languages, matchLanguage, [
      signals.queryLanguage,
      cookie.language,
      signals.fluidLanguageCookie,
      ...acceptedLanguages(signals.acceptLanguage),
    ]) ??
    market.languages[0] ??
    "en";

  const country =
    firstMatch(market.countries, matchCountry, [
      signals.queryCountry,
      cookie.country,
      signals.fluidCountryCookie,
      signals.geoCountry,
    ]) ??
    market.countries[0] ??
    "US";

  return { language, country };
}

function firstMatch(
  supported: readonly string[],
  match: (supported: readonly string[], candidate: string) => string | undefined,
  candidates: (string | null | undefined)[],
): string | undefined {
  for (const candidate of candidates) {
    const found = candidate?.trim() && match(supported, candidate.trim());
    if (found) return found;
  }
  return undefined;
}

/** `zh-tw` matches `zh-TW` exactly; `en-GB` falls back to `en`. */
function matchLanguage(supported: readonly string[], candidate: string): string | undefined {
  const wanted = candidate.toLowerCase();
  const primary = wanted.split("-")[0];
  return (
    supported.find((language) => language.toLowerCase() === wanted) ??
    supported.find((language) => language.toLowerCase() === primary)
  );
}

function matchCountry(supported: readonly string[], candidate: string): string | undefined {
  const wanted = candidate.toUpperCase();
  return supported.find((country) => country === wanted);
}

/** Language ranges from an Accept-Language header, by preference. */
export function acceptedLanguages(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((entry, index) => {
      const [range = "", ...params] = entry.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { range: range.trim(), weight: Number.isNaN(weight) ? 0 : weight, index };
    })
    .filter(({ range, weight }) => range && range !== "*" && weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index)
    .map(({ range }) => range.toLowerCase());
}
