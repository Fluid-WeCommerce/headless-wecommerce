import { loadRecord, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/media/[slug]">) {
  return recordMetadata("medium", params);
}

export default async function MediumRoute({ params }: PageProps<"/[locale]/[credit]/media/[slug]">) {
  const { context, record } = await loadRecord("medium", params);
  return renderTemplate("medium", record.slug, { ...context, medium: record });
}
