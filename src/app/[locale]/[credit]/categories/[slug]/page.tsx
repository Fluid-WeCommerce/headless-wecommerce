import { productsPerPage } from "@/config/site";
import { listProductsIn } from "@/lib/fluid/storefront";
import { loadRecord, param, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/categories/[slug]">) {
  return recordMetadata("category", params);
}

export default async function CategoryRoute({ params, searchParams }: PageProps<"/[locale]/[credit]/categories/[slug]">) {
  const { context, record, path } = await loadRecord("category", params);
  const products = await listProductsIn("category", record.slug ?? (await params).slug, {
    locale: context.locale,
    limit: productsPerPage,
    cursor: param((await searchParams).cursor),
  });
  return renderTemplate("category", record.slug, { ...context, category: record, products: { ...products, basePath: path } });
}
