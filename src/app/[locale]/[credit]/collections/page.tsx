import { listResources } from "@/lib/fluid/storefront";
import { pageContext, param, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/collections">) {
  return staticMetadata(params, { path: "/collections", title: "Collections" });
}

export default async function CollectionsRoute({ params, searchParams }: PageProps<"/[locale]/[credit]/collections">) {
  const context = await pageContext(params);
  const collections = await listResources("collection", {
    locale: context.locale,
    limit: 48,
    cursor: param((await searchParams).cursor),
  });
  return renderTemplate("collection_page", null, { ...context, collections });
}
