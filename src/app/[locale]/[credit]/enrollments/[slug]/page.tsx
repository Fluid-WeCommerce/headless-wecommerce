import { loadRecord, recordMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/enrollments/[slug]">) {
  return recordMetadata("enrollment_pack", params);
}

export default async function EnrollmentPackRoute({ params }: PageProps<"/[locale]/[credit]/enrollments/[slug]">) {
  const { context, record } = await loadRecord("enrollment_pack", params);
  return renderTemplate("enrollment_pack", record.slug, { ...context, enrollmentPack: record });
}
