import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/sections/PageHeader";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function CollectionDefault({ collection, products }: TemplateProps["collection"]) {
  return (
    <>
      <PageHeader eyebrow="Collection" title={collection.title} description={collection.description} html />
      <section className="page-width">
        <ProductGrid products={products.items} />
        <Pagination basePath={products.basePath} pagination={products.pagination} />
      </section>
    </>
  );
}
