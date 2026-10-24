import { productsPerPage } from "@/config/site";
import { listProductsIn } from "@/lib/fluid/storefront";
import { loadRecord, param, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/collections/[slug]">) {
  return recordMetadata("collection", params);
}

export default async function CollectionRoute({ params, searchParams }: PageProps<"/[locale]/[credit]/collections/[slug]">) {
  const { context, record, path } = await loadRecord("collection", params);
  const products = await listProductsIn("collection", record.slug ?? (await params).slug, {
    locale: context.locale,
    limit: productsPerPage,
    cursor: param((await searchParams).cursor),
  });
  return renderTemplate("collection", record.slug, {
    ...context,
    collection: record,
    products: { ...products, basePath: path },
  });
}
