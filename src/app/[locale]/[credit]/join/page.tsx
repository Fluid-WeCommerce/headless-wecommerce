import { listResources } from "@/lib/fluid/storefront";
import { pageContext, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export async function generateMetadata({ params }: PageProps<"/[locale]/[credit]/join">) {
  const { shop } = await pageContext(params);
  return staticMetadata(params, { path: "/join", title: `Join ${shop.name}` });
}

export default async function JoinRoute({ params }: PageProps<"/[locale]/[credit]/join">) {
  const context = await pageContext(params);
  const packs = await listResources("enrollment_pack", { locale: context.locale, limit: 50 });
  return renderTemplate("join_page", null, { ...context, enrollmentPacks: packs.items });
}
