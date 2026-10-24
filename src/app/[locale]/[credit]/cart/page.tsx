import { pageContext, staticMetadata } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

export async function generateMetadata({ params }: PageProps<"/[locale]/[credit]/cart">) {
  return {
    ...(await staticMetadata(params, { path: "/cart", title: "Cart" })),
    robots: { index: false, follow: true },
  };
}

export default async function CartRoute({ params }: PageProps<"/[locale]/[credit]/cart">) {
  return renderTemplate("cart_page", null, await pageContext(params));
}
