import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/sections/PageHeader";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function CategoryDefault({ category, products }: TemplateProps["category"]) {
  return (
    <>
      <PageHeader title={category.title} description={category.description} html />
      <section className="page-width pb-16">
        <ProductGrid products={products.items} />
        <Pagination basePath={products.basePath} pagination={products.pagination} />
      </section>
    </>
  );
}
