import { listResources } from "@/lib/fluid/storefront";
import { pageContext, param, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Filters and pagination come from the query string; Fluid data is still cached. */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  return staticMetadata(params, { path: "/blog", title: "Blog" });
}

export default async function BlogRoute({ params, searchParams }: PageProps<"/[locale]/blog">) {
  const context = await pageContext(params);
  const posts = await listResources("post", {
    locale: context.locale,
    limit: 12,
    sort: "-created_at",
    cursor: param((await searchParams).cursor),
  });
  return renderTemplate("post_page", null, { ...context, posts });
}
