import { SectionHeading } from "@/components/SectionHeading";
import { MainProduct } from "@/sections/MainProduct";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function ProductDefault({ product, related, locale }: TemplateProps["product"]) {
  return (
    <>
      <MainProduct product={product} country={locale.country} />
      {related.length ? (
        <section className="page-width py-20 sm:py-24">
          <SectionHeading title="You may also like" link={{ label: "View all", href: "/shop" }} />
          <ProductGrid products={related} />
        </section>
      ) : null}
    </>
  );
}
