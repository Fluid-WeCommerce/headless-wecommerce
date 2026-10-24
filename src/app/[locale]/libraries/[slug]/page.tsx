import { getLibraryItems } from "@/lib/fluid/storefront";
import { loadRecord, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/libraries/[slug]">) {
  return recordMetadata("library", params);
}

export default async function LibraryRoute({ params }: PageProps<"/[locale]/libraries/[slug]">) {
  const { context, record } = await loadRecord("library", params);
  const items = await getLibraryItems(record, context.locale);
  return renderTemplate("library", record.slug, { ...context, library: record, items });
}
