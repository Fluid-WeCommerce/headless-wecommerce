import { resourcePath } from "@/lib/fluid/resources";
import type { ProductCard as ProductCardData } from "@/lib/fluid/types";

import { Price } from "./Price";
import { ResourceCard } from "./ResourceCard";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <ResourceCard
      href={resourcePath("product", product.slug)}
      title={product.title}
      images={product.images}
      imageUrl={product.image_url}
      badge={!product.in_stock ? "Sold out" : undefined}
    >
      <Price pricing={product.pricing} className="block text-[15px] text-muted" />
    </ResourceCard>
  );
}
