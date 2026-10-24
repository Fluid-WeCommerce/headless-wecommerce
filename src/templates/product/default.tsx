import { SectionHeading } from "@/components/SectionHeading";
import { MainProduct } from "@/sections/MainProduct";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function ProductDefault({ product, related, locale }: TemplateProps["product"]) {
  return (
    <>
      <MainProduct product={product} country={locale.country} />
      {related.length ? (
        <section className="page-width py-16">
          <SectionHeading title="You may also like" />
          <ProductGrid products={related} />
        </section>
      ) : null}
    </>
  );
}
