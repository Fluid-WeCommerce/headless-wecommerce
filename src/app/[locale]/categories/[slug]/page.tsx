import { productsPerPage } from "@/config/site";
import { listProductsIn } from "@/lib/fluid/storefront";
import { loadRecord, param, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/categories/[slug]">) {
  return recordMetadata("category", params);
}

export default async function CategoryRoute({ params, searchParams }: PageProps<"/[locale]/categories/[slug]">) {
  const { context, record, templateId, path } = await loadRecord("category", params);
  const products = await listProductsIn("category", record.slug ?? (await params).slug, {
    locale: context.locale,
    limit: productsPerPage,
    cursor: param((await searchParams).cursor),
  });
  return renderTemplate("category", templateId, { ...context, category: record, products: { ...products, basePath: path } });
}
