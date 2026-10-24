# Templates

Templates decide what each storefront page looks like. They mirror the
template types in a Fluid theme, so the template you pick for a product in
Fluid admin is the template this storefront renders for it.

```
templates/
  product/            one folder per Fluid template type (themeable_type)
    index.ts          the registry: Fluid template ID → component
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

## Add a template for a Fluid template

1. In Fluid admin, create a template of the right type (for example a
   product template called "Landing") and note its ID.
2. Create a component in the matching folder, typed with that type's props:

   ```tsx
   // src/templates/product/landing.tsx
   import type { TemplateProps } from "../types";

   export default function ProductLanding({ product, locale }: TemplateProps["product"]) {
     return <h1>{product.title}</h1>;
   }
   ```

3. Register it under the template's ID in the folder's `index.ts`:

   ```ts
   export default defineTemplates<"product">({
     default: ProductDefault,
     4821: ProductLanding,
   });
   ```

4. Assign the template to products in Fluid admin. Those products now render
   with `ProductLanding`; everything else keeps `default`.

Record types (`product`, `enrollment_pack`, `medium`, `library`, `page`,
`post`, `collection`, `category`) can have any number of templates. The other
types have one template per theme in Fluid, so only their `default` is used.

## Where the template ID comes from

The route reads `template_id` from the record's public show response. It is
`null` when the record has no template assigned, so `default` renders. If a
merchant explicitly picks the theme's default template in Fluid admin, the
record gets that template's ID; it isn't registered here, so `default`
renders for it too. Register the default template's ID only if you want
explicitly assigned records to look different from unassigned ones.

Until Fluid's API returns `template_id`, the storefront reads the template
from the company API when `FLUID_COMPANY_PRIVATE_TOKEN` is set, and uses
`default` otherwise. See `src/lib/fluid/company.ts`.

## What templates receive

Every template gets `shop` (name, logo, colors, languages, countries) and
`locale` (the visitor's language and country), plus its own data; see
`types.ts`. Templates are React Server Components: fetch more data in them
if you need it (e.g. `listProducts` from `@/lib/fluid/storefront`), and use
client components such as `AddToCartButton` for interactivity.

Head tags (title, description, Open Graph, canonical, hreflang, JSON-LD) are
built by the route from Fluid's SEO fields, so every template gets them for
free.
