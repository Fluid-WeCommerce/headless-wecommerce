# Templates

Templates decide what each storefront page looks like. There is a folder for
each template type in a Fluid theme. Every folder has a `default` template,
and a record can get its own design by registering a template under its
slug.

```
templates/
  product/            one folder per Fluid template type (themeable_type)
    index.ts          the registry: record slug → component
    default.tsx       used when a record has no template, or an unknown one
    landing.tsx       an example alternate template
  enrollment_pack/  medium/  library/  page/  post/  collection/  category/
  home_page/  shop_page/  category_page/  collection_page/  post_page/
  join_page/  cart_page/  search_page/  error_page/  navbar/  footer/
  registry.ts         wires the folders together; renderTemplate()
  types.ts            the props each template type receives
```

Templates compose **sections** (`src/sections`, e.g. `MainProduct`, `Hero`,
`ProductGrid`), which compose **components** (`src/components`). That is the
same layering as a Fluid theme's `templates/`, `sections/` and `components/`.

## Give a record its own template

1. Create a component in the matching folder, typed with that type's props:

   ```tsx
   // src/templates/product/landing.tsx
   import type { TemplateProps } from "../types";

   export default function ProductLanding({ product, locale }: TemplateProps["product"]) {
     return <h1>{product.title}</h1>;
   }
   ```

2. Register it under the record's slug in the folder's `index.ts`:

   ```ts
   export default defineTemplates<"product">({
     default: ProductDefault,
     "beet-blend": ProductLanding,
   });
   ```

   `/products/beet-blend` now renders with `ProductLanding`. Every other
   product keeps `default`. Register one component under several slugs to
   share a design.

The slug is the one Fluid returns for the record, which is also the last
part of its URL. If a merchant changes a record's slug in Fluid, update the
key here too, or the record goes back to `default`.

Record types (`product`, `enrollment_pack`, `medium`, `library`, `page`,
`post`, `collection`, `category`) match by slug. The other types have no
record, so they always use `default`.

## What templates receive

Every template gets `shop` (name, logo, colors, languages, countries) and
`locale` (the visitor's language and country), plus its own data; see
`types.ts`. Templates are React Server Components: fetch more data in them
if you need it (e.g. `listProducts` from `@/lib/fluid/storefront`), and use
client components such as `AddToCartButton` for interactivity.

Head tags (title, description, Open Graph, canonical, hreflang, JSON-LD) are
built by the route from Fluid's SEO fields, so every template gets them for
free.
