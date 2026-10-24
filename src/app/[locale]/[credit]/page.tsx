import { pageContext, staticMetadata } from "@/lib/page";
import { listProducts, listResources } from "@/lib/fluid/storefront";
import { renderTemplate } from "@/templates/registry";

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]">) {
  return staticMetadata(params, { path: "/" });
}

export default async function HomeRoute({ params }: PageProps<"/[locale]/[credit]">) {
  const context = await pageContext(params);
  const [featured, collections, posts] = await Promise.all([
    listProducts({ locale: context.locale, limit: 8 }),
    listResources("collection", { locale: context.locale, limit: 4 }),
    listResources("post", { locale: context.locale, limit: 3, sort: "-created_at" }),
  ]);

  return renderTemplate("home_page", null, {
    ...context,
    featured: featured.items,
    collections: collections.items,
    posts: posts.items,
  });
}
