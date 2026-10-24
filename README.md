# Headless WeCommerce

A headless storefront for [Fluid](https://fluid.app), built with Next.js.
Run your Fluid store on your own domain and servers while Fluid stays the
source of truth for products, content, carts, checkout and attribution.

Point it at a Fluid company with one environment variable and it renders
the whole storefront: home, shop, products, enrollment packs, media,
libraries, categories, collections, blog, pages, cart and search. It uses
Fluid's languages, countries, prices, SEO settings and brand colors, runs the
Fairshare SDK for tracking and rep attribution, and hands carts to Fluid
checkout.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFluid-WeCommerce%2Fheadless-wecommerce&env=FLUID_SHOP&envDescription=Your%20Fluid%20company%20subdomain%20(acme%20for%20acme.fluid.app)&project-name=fluid-storefront)

## Quick start

```bash
pnpm install
cp .env.example .env.local   # set FLUID_SHOP=<your subdomain>
pnpm dev                     # http://localhost:3000
```

Requires Node.js 20.9+ and pnpm.

## Deploy

**As a Fluid Mist app.** Create a Mist app from this template in Fluid.
Fluid creates the repository and the Vercel project, injects
`FLUID_BASE_URL` and the company tokens, and deploys. Attach your domain to
the Mist app and the storefront is live on it. Nothing else to configure.

**On Vercel.** Use the button above, or import the repository, and set
`FLUID_SHOP`. Add your domain under Project → Domains; canonical URLs and
the sitemap follow the production domain automatically.

**Anywhere else.** `pnpm build && pnpm start` on any Node.js host. Set
`NEXT_PUBLIC_SITE_URL` to the public URL.

See [.env.example](.env.example) for every setting.

## How it works

```
Browser ──► proxy.ts ──► app/[locale]/[credit]/<route> ──► templates/<type> ──► sections ──► components
              │                │
              │                └─ lib/fluid: Fluid's public storefront API (server-side, cached)
              └─ locale cookie, rep credit paths, legacy redirects

Browser ──► Fairshare SDK (assets.fluid.app) ──► Fluid: page views, attribution, cart ──► Fluid checkout
```

### Pages and URLs

URLs match Fluid-hosted storefronts, so existing links, shares and QR codes
keep working.

| URL | Template type | Data |
| --- | --- | --- |
| `/` | `home_page` | featured products, collections, latest posts |
| `/shop` | `shop_page` | products with search, sort and category filters |
| `/products/:slug` | `product` | product, variants, country pricing, subscriptions |
| `/enrollments/:slug`, `/join` | `enrollment_pack`, `join_page` | enrollment packs |
| `/media/:slug` | `medium` | video, PDF, slides or image with its call to action |
| `/libraries/:slug` | `library` | a Fluid playlist |
| `/categories`, `/categories/:slug` | `category_page`, `category` | categories and their products |
| `/collections`, `/collections/:slug` | `collection_page`, `collection` | collections and their products |
| `/blog`, `/blog/:slug` | `post_page`, `post` | blog posts |
| `/pages/:slug` | `page` | pages |
| `/cart` | `cart_page` | the visitor's Fluid cart |
| `/search?q=` | `search_page` | products, collections, categories and posts |

As on Fluid, every page sits behind a credit slot, `/:credit/...`: a rep's
username (`/jane/products/beet-blend`, which the Fairshare SDK attributes to
Jane) or `home` when there's no rep (`/home/products/beet-blend`). Links
keep the visitor's credit, so a shopper who arrives through Jane's link
stays on `/jane/shop`, `/jane/collections` and so on. Paths without a
credit (`/shop`) work too and link onward to `/home/...`. Canonical URLs
and the sitemap use `/home/...`, like Fluid's. Fluid's older paths
(`/posts/:slug`, `/page/:slug`, `/library/:slug`, `/shop/:slug`) redirect
to the current ones.

Build internal links with `SiteLink` or `ButtonLink`, which add the credit
for you. For anything else, such as a form's `action`, use
`sitePath(credit, path)`; templates receive `credit` in their props.

### Templates

Each Fluid template type has a folder in [`src/templates`](src/templates)
(`product`, `enrollment_pack`, `medium`, `library`, `page`, `post`,
`collection`, `category`, plus the page types such as `home_page`,
`shop_page` and `cart_page`). Every folder has a `default.tsx` and an
`index.ts` that registers its templates.

A record picks its template by slug:

1. If the folder's `index.ts` registers a template under the record's
   slug, that template renders.
2. Otherwise `default` renders.

```ts
// src/templates/product/index.ts
export default defineTemplates<"product">({
  default: ProductDefault,         // every other product
  "beet-blend": ProductLanding,    // /products/beet-blend
});
```

The slug is the one Fluid returns for the record, which is also the last
part of its URL. If a merchant renames a slug in Fluid, update the key or
the record goes back to `default`. The template chosen in Fluid admin is not
used: Fluid's public API doesn't return it, and the storefront's design
lives in this code. Page types (`home_page`, `shop_page`, `cart_page` and
the rest) have no record, so they always render `default`.

Templates compose sections (`src/sections`), which compose components
(`src/components`), the same layering as a Fluid theme. See
[src/templates/README.md](src/templates/README.md) for a walkthrough.

### Languages and countries

The storefront offers the languages and countries enabled for the company in
Fluid. A visitor's locale is picked like Fluid does it: `?lang=` and
`?country=`, then the `fluid_locale` cookie, then the browser language and
the visitor's country (Vercel's geo header), then the company default.
Prices, currencies and product availability follow the country; content
follows the language. The choice is stored in the same `fluid_locale` cookie
the SDK and checkout read, so the cart and checkout stay in step. Every
language/country pair is cached separately. A language and country switcher
is in the footer.

### SEO

Every page gets a title, meta description, canonical URL, Open Graph and
Twitter tags, and `hreflang` alternates, from the SEO settings in Fluid with
the same fallbacks Fluid uses. Records Fluid marks as not indexable get
`noindex`. Products, posts and the site carry schema.org JSON-LD. There's a
sitemap at `/sitemap.xml` and a `robots.txt` that blocks Vercel previews.

### Cart, checkout and tracking

The Fairshare SDK, the same bundle Fluid-hosted themes load, runs on every
page. It records page views (including client-side navigation), attributes
visits from `/username` paths and share links, keeps the cart (with Fluid's
cart drawer), and hands off to Fluid checkout with the visitor's session, so
checkout works from any domain. Use `useCart()` and `useSdkAction()` from
`src/lib/fairshare/hooks.ts` to build your own cart UI.

**Testing checkout locally:** open the site at `http://127.0.0.1:3000`, not
`http://localhost:3000`. On any hostname containing `localhost`, the SDK
sends checkout to `http://localhost:4444`, Fluid's own local checkout
server, instead of `checkout.fluid.app`. Deployed sites always use
`checkout.fluid.app`.

### Caching

Fluid responses are cached for `FLUID_REVALIDATE_SECONDS` (5 minutes by
default). To refresh sooner, `POST /api/revalidate` with
`Authorization: Bearer $REVALIDATE_SECRET` and optional
`{ "tags": ["fluid:product:beet-blend"] }`; point a Fluid webhook at it to
update on every change.

## Project structure

```
src/
  proxy.ts              locale, rep credit and legacy-path handling
  app/[locale]/[credit] routes; [locale] is internal and never in a URL
  templates/            one folder per Fluid template type
  sections/             page sections (MainProduct, Hero, ProductGrid, MainCart…)
  components/           UI building blocks
  config/site.ts        settings you edit: navigation fallback, page sizes
  lib/fluid/            Fluid API client, types, locale and URL rules
  lib/fairshare/        Fairshare SDK loader, types and React hooks
  lib/seo.ts            head tags
```

## Scripts

| Command | |
| --- | --- |
| `pnpm dev` | development server |
| `pnpm build` / `pnpm start` | production build and server |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` | ESLint |
| `pnpm test` | unit tests (Vitest) |

## What comes from Fluid's public API

Everything the storefront renders comes from Fluid's public storefront API,
with no token, except where noted.

| Need | Source | Used for |
| --- | --- | --- |
| Records and lists | `/api/v202604/{products,enrollment-packs,media,playlists,pages,posts,collections,categories}` | every page, the sitemap |
| SEO title, description, image | each record's `seo` | `<title>`, meta description, Open Graph, Twitter |
| Indexing | `seo.indexable` (false for drafts, scheduled, inactive and noindex records) | `noindex` |
| Translations | each record's `languages`, and `?lang=` | content language, `hreflang` |
| Prices, currency, stock | `pricing`, `variant_countries`, `in_stock`, with `?country=` | prices, product JSON-LD offers |
| Post author and date | `post_author`, `post_date` | article JSON-LD |
| Last modified | `updated_at` | sitemap `lastmod` |
| Brand: name, logo, icon, colors | settings endpoint (needs a Fairshare session; the server opens one) | header, favicon, theme colors, organization JSON-LD |
| Languages and countries | settings endpoint | locale switcher, locale detection |
| Cart, checkout, tracking, attribution | Fairshare SDK in the browser | cart, checkout, page views |

### Not available publicly

- **Page bodies.** A page returns its title, description, image and
  metafields, but not its page-builder content. Build page content in a
  template; metafields are a good place for editable copy.
- **Library items** need Fluid to return each item's `relateable_slug`
  (fluid-commerce/fluid#28751). The library page loads items by slug, so
  until that ships it shows the playlist without its items.
- **Navigation.** Fluid menus need `FLUID_COMPANY_PRIVATE_TOKEN`. Without it,
  the links in `src/config/site.ts` are used.
- **Redirects.** Redirects set up in Fluid admin aren't exposed, so they
  don't apply here. Add them to `redirects` in `next.config.ts`. Fluid's
  built-in legacy paths are handled in `src/proxy.ts`.
- **Google Tag Manager.** The company's GTM ID isn't exposed. Add your tag
  to `src/app/[locale]/layout.tsx`.
- **Organization details** such as social profiles and contact info aren't
  exposed, so the organization JSON-LD has the name, URL and logo only.
- **Product identifiers and reviews.** There's no product brand, GTIN or
  rating data, so product JSON-LD uses the shop name as the brand and has
  no `gtin` or `aggregateRating`.
- **Theme template choice.** The template assigned in Fluid admin isn't
  returned, which is why templates are matched by slug.

## License

[MIT](LICENSE)
