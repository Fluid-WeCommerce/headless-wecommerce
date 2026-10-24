import { NextResponse, type NextRequest } from "next/server";

import { cookieDomainFor } from "@/lib/fluid/cookies";
import {
  fluidLocaleValue,
  LOCALE_COOKIES,
  localeSegment,
  resolveLocale,
  type LocaleMarket,
} from "@/lib/fluid/locale";
import { NO_CREDIT, parseStorefrontPath } from "@/lib/fluid/routes";
import { getShop } from "@/lib/fluid/shop";

/**
 * Runs before every page request:
 *
 * 1. Redirects legacy Fluid paths (`/posts/x` → `/blog/x`).
 * 2. Resolves the visitor's language and country, persisting the choice in
 *    the same cookies Fluid and the SDK use.
 * 3. Rewrites to the internal `/[locale]/[credit]` segments:
 *    `/jane/products/x` renders `/en_US/jane/products/x`, and a path with
 *    no rep renders under `home`. The browser keeps the original URL, which
 *    the Fairshare SDK reads to attribute the visit.
 */
export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname, credit, legacy } = parseStorefrontPath(nextUrl.pathname);

  if (legacy) {
    const target = nextUrl.clone();
    target.pathname = credit ? `/${credit}${pathname}` : pathname;
    return NextResponse.redirect(target, 308);
  }

  const query = nextUrl.searchParams;
  const locale = resolveLocale(
    {
      queryLanguage: query.get("lang") ?? query.get("locale"),
      queryCountry: query.get("country") ?? query.get("country_code"),
      fluidLocaleCookie: request.cookies.get(LOCALE_COOKIES.locale)?.value,
      fluidLanguageCookie: request.cookies.get(LOCALE_COOKIES.language)?.value,
      fluidCountryCookie: request.cookies.get(LOCALE_COOKIES.country)?.value,
      acceptLanguage: request.headers.get("accept-language"),
      geoCountry: request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry"),
    },
    await market(),
  );

  const target = nextUrl.clone();
  target.pathname = `/${localeSegment(locale)}/${credit ?? NO_CREDIT}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.rewrite(target);

  if (request.cookies.get(LOCALE_COOKIES.locale)?.value !== fluidLocaleValue(locale)) {
    const options = {
      path: "/",
      domain: cookieDomainFor(nextUrl.hostname),
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax" as const,
    };
    response.cookies.set(LOCALE_COOKIES.locale, fluidLocaleValue(locale), options);
    response.cookies.set(LOCALE_COOKIES.language, locale.language, options);
    response.cookies.set(LOCALE_COOKIES.country, locale.country, options);
  }

  return response;
}

export const config = {
  // Every page, but not API routes, Next.js internals or files (sitemap.xml, robots.txt, images).
  matcher: ["/((?!api/|_next/|.*\\.[\\w]+$).*)"],
};

/**
 * The company's languages and countries. The proxy runs outside the
 * rendering cache, so it keeps its own copy for a few minutes.
 */
const MARKET_TTL_MS = 5 * 60 * 1000;
let cachedMarket: { value: LocaleMarket; expires: number } | undefined;

async function market(): Promise<LocaleMarket> {
  if (cachedMarket && cachedMarket.expires > Date.now()) return cachedMarket.value;
  try {
    const { languages, countries } = await getShop({ revalidate: false });
    cachedMarket = { value: { languages, countries }, expires: Date.now() + MARKET_TTL_MS };
    return cachedMarket.value;
  } catch (error) {
    console.error("[fluid] Could not load shop languages and countries", error);
    return cachedMarket?.value ?? { languages: ["en"], countries: ["US"] };
  }
}
