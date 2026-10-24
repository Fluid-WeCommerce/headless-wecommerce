import { listResources } from "@/lib/fluid/storefront";
import { pageContext, param, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/categories">) {
  return staticMetadata(params, { path: "/categories", title: "Categories" });
}

export default async function CategoriesRoute({ params, searchParams }: PageProps<"/[locale]/categories">) {
  const context = await pageContext(params);
  const categories = await listResources("category", {
    locale: context.locale,
    limit: 48,
    cursor: param((await searchParams).cursor),
  });
  return renderTemplate("category_page", null, { ...context, categories });
}
