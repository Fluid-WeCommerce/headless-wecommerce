import { RichText } from "@/components/RichText";
import { Hero } from "@/sections/Hero";
import { ProductForm } from "@/sections/MainProduct/ProductForm";

import type { TemplateProps } from "../types";

/**
 * An example alternate template: a long-form landing page with the buy box
 * up top. Register it in ./index.ts under a product's slug to use it for
 * that product.
 */
export default function ProductLanding({ product, locale }: TemplateProps["product"]) {
  return (
    <>
      <Hero title={product.title} images={product.images} imageUrl={product.image_url} />
      <section className="page-width grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <RichText html={product.description} />
        <div className="h-fit rounded-2xl bg-surface p-6 lg:sticky lg:top-24">
          <ProductForm product={product} country={locale.country} />
        </div>
      </section>
    </>
  );
}
