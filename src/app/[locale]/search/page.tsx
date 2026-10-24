import { productsPerPage } from "@/config/site";
import { listProducts, listResources } from "@/lib/fluid/storefront";
import { pageContext, param, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/search">) {
  return {
    ...(await staticMetadata(params, { path: "/search", title: "Search" })),
    robots: { index: false, follow: true },
  };
}

export default async function SearchRoute({ params, searchParams }: PageProps<"/[locale]/search">) {
  const context = await pageContext(params);
  const q = param((await searchParams).q) ?? "";
  if (!q) {
    return renderTemplate("search_page", null, { ...context, q, products: [], collections: [], categories: [], posts: [] });
  }

  const { locale } = context;
  const [products, collections, categories, posts] = await Promise.all([
    listProducts({ locale, q, limit: productsPerPage }),
    listResources("collection", { locale, q, limit: 4 }),
    listResources("category", { locale, q, limit: 4 }),
    listResources("post", { locale, q, limit: 4 }),
  ]);

  return renderTemplate("search_page", null, {
    ...context,
    q,
    products: products.items,
    collections: collections.items,
    categories: categories.items,
    posts: posts.items,
  });
}
