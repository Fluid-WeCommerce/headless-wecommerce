import { productsPerPage } from "@/config/site";
import { listProducts, listResources } from "@/lib/fluid/storefront";
import { pageContext, param, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/shop">) {
  return staticMetadata(params, { path: "/shop", title: "Shop" });
}

export default async function ShopRoute({ params, searchParams }: PageProps<"/[locale]/[credit]/shop">) {
  const context = await pageContext(params);
  const search = await searchParams;
  const query = { q: param(search.q), sort: param(search.sort), category: param(search.category) };

  const categories = await listResources("category", { locale: context.locale, limit: 100 });
  const category = categories.items.find((candidate) => candidate.slug === query.category);

  const products = await listProducts({
    locale: context.locale,
    limit: productsPerPage,
    cursor: param(search.cursor),
    q: query.q,
    sort: query.sort,
    categoryIds: category ? [category.id] : undefined,
  });

  return renderTemplate("shop_page", null, {
    ...context,
    query,
    categories: categories.items.filter((candidate) => candidate.parent_id === null),
    products: { ...products, basePath: "/shop" },
  });
}
