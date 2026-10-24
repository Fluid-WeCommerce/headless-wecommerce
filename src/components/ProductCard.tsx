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
    >
      <p className="text-sm">
        <Price pricing={product.pricing} />
        {!product.in_stock ? <span className="ml-2 text-muted">Sold out</span> : null}
      </p>
    </ResourceCard>
  );
}
