import { loadRecord, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/pages/[slug]">) {
  return recordMetadata("page", params);
}

export default async function PageRoute({ params }: PageProps<"/[locale]/[credit]/pages/[slug]">) {
  const { context, record } = await loadRecord("page", params);
  return renderTemplate("page", record.slug, { ...context, page: record });
}
