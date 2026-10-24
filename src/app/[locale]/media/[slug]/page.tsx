import { loadRecord, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/media/[slug]">) {
  return recordMetadata("medium", params);
}

export default async function MediumRoute({ params }: PageProps<"/[locale]/media/[slug]">) {
  const { context, record, templateId } = await loadRecord("medium", params);
  return renderTemplate("medium", templateId, { ...context, medium: record });
}
