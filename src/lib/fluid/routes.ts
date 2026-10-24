/**
 * Storefront URL scheme, matching Fluid-hosted storefronts.
 *
 *   /                          home_page
 *   /shop                      shop_page (also /products)
 *   /products/:slug            product
 *   /enrollments/:slug         enrollment_pack
 *   /join                      join_page
 *   /media/:slug               medium
 *   /libraries/:slug           library (a Fluid playlist)
 *   /categories[/:slug]        category_page / category
 *   /collections[/:slug]       collection_page / collection
 *   /blog[/:slug]              post_page / post
 *   /pages/:slug               page
 *   /cart                      cart_page
 *   /search                    search results
 *
 * Every page sits behind a "credit" slot, as on Fluid: a rep's username
 * (`/jane/products/beet-blend`, which Fairshare attributes to Jane) or
 * `home` when there's no rep (`/home/products/beet-blend`). Links keep the
 * visitor's credit, so a shopper who arrives through Jane stays on
 * `/jane/...`. Paths without a credit (`/shop`) work too and render as
 * `home`.
 */

/** The credit slot for visits without a rep. */
export const NO_CREDIT = "home";

export const ROUTE_SEGMENTS = [
  "shop",
  "products",
  "enrollments",
  "join",
  "media",
  "libraries",
  "categories",
  "collections",
  "blog",
  "pages",
  "cart",
  "search",
] as const;

/** Older Fluid paths and where they live now. */
const LEGACY_SEGMENTS: Record<string, string> = {
  posts: "blog",
  post: "media",
  page: "pages",
  library: "libraries",
};

const KNOWN_SEGMENTS = new Set<string>([...ROUTE_SEGMENTS, ...Object.keys(LEGACY_SEGMENTS), "my", "api"]);

const USERNAME = /^[a-z0-9][a-z0-9_-]*$/i;

export interface StorefrontPath {
  /** The path to render, without any credit prefix. */
  pathname: string;
  /** The rep username in the credit slot, if any (`home` counts as none). */
  credit: string | null;
  /** True when the request used a legacy alias and should be redirected. */
  legacy: boolean;
}

/** Split a request path into the rep credit and the page it points at. */
export function parseStorefrontPath(pathname: string): StorefrontPath {
  let segments = pathname.split("/").filter(Boolean);
  let credit: string | null = null;

  const [first, second] = segments;
  if (first === "my" && second) {
    // A rep's personal site: /my/<username> is their home page.
    credit = second;
    segments = segments.slice(2);
  } else if (
    first &&
    !KNOWN_SEGMENTS.has(first) &&
    USERNAME.test(first) &&
    (segments.length === 1 || (second !== undefined && KNOWN_SEGMENTS.has(second)))
  ) {
    credit = first;
    segments = segments.slice(1);
  }

  let legacy = false;
  const [head, slug] = segments;
  if (head && head in LEGACY_SEGMENTS) {
    segments = [LEGACY_SEGMENTS[head]!, ...segments.slice(1)];
    legacy = true;
  } else if (head === "shop" && slug) {
    // Fluid also serves products at /shop/:slug.
    segments = ["products", ...segments.slice(1)];
    legacy = true;
  }

  return {
    pathname: `/${segments.join("/")}`,
    credit: credit && credit.toLowerCase() !== "home" ? credit : null,
    legacy,
  };
}

/**
 * A path on this site under a credit slot: `sitePath("jane", "/shop")` is
 * `/jane/shop`, and without a rep `/home/shop`. A credit already in `href`
 * is replaced, so links from Fluid (`/home/shop`) follow the visitor's rep.
 * Anything that isn't a site path (`https://…`, `#reviews`, `mailto:`) is
 * returned untouched.
 */
export function sitePath(credit: string | null | undefined, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;

  const url = new URL(href, "http://site");
  const { pathname } = parseStorefrontPath(url.pathname);
  return `/${credit || NO_CREDIT}${pathname === "/" ? "" : pathname}${url.search}${url.hash}`;
}

/**
 * Turn a link from the Fluid API (a menu item's URL) into a path on this
 * site. Relative links and links to the company's Fluid storefront become
 * local paths; anything else is returned untouched so external links work.
 */
export function toSitePath(url: string | null | undefined, fluidStorefrontUrl: string): string {
  if (!url) return "/";

  let parsed: URL;
  try {
    parsed = new URL(url, fluidStorefrontUrl);
  } catch {
    return url;
  }

  if (parsed.origin !== new URL(fluidStorefrontUrl).origin) return parsed.toString();

  const { pathname } = parseStorefrontPath(parsed.pathname);
  return `${pathname}${parsed.search}${parsed.hash}`;
}
