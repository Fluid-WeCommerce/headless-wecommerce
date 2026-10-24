import { FluidImage } from "@/components/FluidImage";
import type { Product } from "@/lib/fluid/types";

export function ProductGallery({ product }: { product: Product }) {
  const variantImages = product.variants
    .flatMap((variant) => variant.images ?? [])
    .filter((image, index, all) => all.findIndex((other) => other.image_url === image.image_url) === index);

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
        <FluidImage
          images={product.images}
          src={product.image_url}
          alt={product.title}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      {variantImages.length > 1 ? (
        <ul className="grid grid-cols-4 gap-3">
          {variantImages.slice(0, 8).map((image) => (
            <li key={image.id} className="aspect-square overflow-hidden rounded-lg bg-surface">
              <FluidImage src={image.image_url} alt="" sizes="12vw" className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
