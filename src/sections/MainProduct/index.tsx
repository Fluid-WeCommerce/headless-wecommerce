import { RichText } from "@/components/RichText";
import type { Product } from "@/lib/fluid/types";

import { ProductForm } from "./ProductForm";
import { ProductGallery } from "./ProductGallery";

/** The main product section: gallery, title, price, options and description. */
export function MainProduct({ product, country }: { product: Product; country: string }) {
  return (
    <section className="page-width grid gap-10 py-12 lg:grid-cols-2 lg:gap-16">
      <ProductGallery product={product} />
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.title}</h1>
        <ProductForm product={product} country={country} />
        <RichText html={product.description} className="border-t border-border pt-8" />
      </div>
    </section>
  );
}
