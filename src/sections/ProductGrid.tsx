import { ProductCard } from "@/components/ProductCard";
import type { ProductCard as ProductCardData } from "@/lib/fluid/types";

import { EmptyState } from "./EmptyState";

export function ProductGrid({ products, empty = "No products found." }: { products: ProductCardData[]; empty?: string }) {
  if (!products.length) return <EmptyState title={empty} action={{ label: "Browse all products", href: "/shop" }} />;
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-14">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
