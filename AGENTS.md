<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on this storefront

A headless Fluid storefront: Next.js 16 App Router, React 19, Tailwind CSS 4,
pnpm. Read README.md for the architecture and src/templates/README.md for the
template system.

## Rules

- Fluid is the source of truth. Read Fluid data through `src/lib/fluid`
  (`storefront.ts` for public reads, `company.ts` for token-gated reads), on
  the server only. Never send `FLUID_COMPANY_PRIVATE_TOKEN` to the browser or
  name it `NEXT_PUBLIC_*`.
- Cart, checkout and tracking go through the Fairshare SDK
  (`src/lib/fairshare`). Don't call Fluid's cart APIs directly or build
  checkout URLs by hand: `sdk.checkout()` carries the session and attribution.
- Keep URLs identical to Fluid-hosted storefronts (`src/lib/fluid/routes.ts`).
  The `[locale]` route segment is internal; never link to it.
- New page designs go in `src/templates/<type>/`, registered by Fluid template
  ID in that folder's `index.ts`. Routes in `src/app/[locale]` only load data,
  build metadata and call `renderTemplate`.
- Head tags come from `pageMetadata` in `src/lib/seo.ts`; JSON-LD from
  `src/lib/structured-data.ts`.

## Checks

Run before finishing a change:

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

For a live check, set `FLUID_SHOP` in `.env.local` and run `pnpm dev`.
