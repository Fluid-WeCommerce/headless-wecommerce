import { ProductCard } from "@/components/ProductCard";
import type { ProductCard as ProductCardData } from "@/lib/fluid/types";

export function ProductGrid({ products, empty = "No products found." }: { products: ProductCardData[]; empty?: string }) {
  if (!products.length) return <p className="py-12 text-center text-muted">{empty}</p>;
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
