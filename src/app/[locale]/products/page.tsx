import { permanentRedirect } from "next/navigation";

/** Fluid serves its catalog at /products too; this storefront's catalog is /shop. */
export default function ProductsRoute() {
  permanentRedirect("/shop");
}
