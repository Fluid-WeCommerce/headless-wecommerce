import { permanentRedirect } from "next/navigation";

import { sitePath } from "@/lib/fluid/routes";

/** Fluid serves its catalog at /products too; this storefront's catalog is /shop. */
export default async function ProductsRoute({ params }: PageProps<"/[locale]/[credit]/products">) {
  permanentRedirect(sitePath((await params).credit, "/shop"));
}
