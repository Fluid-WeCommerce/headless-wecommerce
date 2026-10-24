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
Browser ──► proxy.ts ──► app/[locale]/<route> ──► templates/<type> ──► sections ──► components
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

Every URL also works behind a rep's username: `/jane/products/beet-blend`
renders the product and the Fairshare SDK attributes the visit to Jane.
`/home/...` (the no-rep form in Fluid's canonical URLs) works too, and
Fluid's older paths (`/posts/:slug`, `/page/:slug`, `/library/:slug`,
`/shop/:slug`) redirect to the current ones.

### Templates

Each Fluid template type has a folder in [`src/templates`](src/templates).
Register a component under a Fluid template ID and every record assigned
that template in Fluid admin renders with it. See
[src/templates/README.md](src/templates/README.md).

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

Locally the SDK sends checkout to `localhost:4444` (Fluid's local checkout).
Test the checkout handoff on a deployed URL.

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
  app/[locale]/         routes; [locale] is internal and never in a URL
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

## Limits of the public API

- **Page bodies.** The API returns a page's title, description, image and
  metafields, but not its page-builder content. Build page content in a
  template; metafields are a good place for editable copy.
- **Library items.** Playlists list their items by record ID only, so the
  default library template shows the playlist without its items.
- **Navigation.** Fluid menus need `FLUID_COMPANY_PRIVATE_TOKEN`. Without it,
  the links in `src/config/site.ts` are used.

## License

[MIT](LICENSE)
