"use client";

import { useState } from "react";

import { FluidImage } from "@/components/FluidImage";
import type { Product, ResponsiveImageSet } from "@/lib/fluid/types";

interface GalleryImage {
  key: string;
  images?: ResponsiveImageSet | null;
  src: string | null | undefined;
}

/** The product's images: a large image, with thumbnails to switch between them. */
export function ProductGallery({ product }: { product: Product }) {
  const gallery = galleryImages(product);
  const [selected, setSelected] = useState(0);
  const current = gallery[selected] ?? gallery[0];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {gallery.length > 1 ? (
        <ul className="flex gap-3 overflow-x-auto lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-visible">
          {gallery.map((image, index) => (
            <li key={image.key} className="shrink-0">
              <button
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={index === selected}
                onClick={() => setSelected(index)}
                className={`block size-20 overflow-hidden rounded-sm bg-surface ring-offset-2 transition ${
                  index === selected ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100"
                }`}
              >
                <FluidImage images={image.images} src={image.src} alt="" sizes="80px" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="aspect-square min-w-0 flex-1 overflow-hidden rounded-sm bg-surface">
        <FluidImage
          images={current?.images}
          src={current?.src}
          alt={product.title}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

/** The product image, then each distinct variant image. */
function galleryImages(product: Product): GalleryImage[] {
  const main: GalleryImage = { key: "product", images: product.images, src: product.image_url };
  const seen = new Set([product.images?.large?.url ?? product.image_url]);
  const variants = product.variants
    .flatMap((variant) => variant.images ?? [])
    .filter((image) => !seen.has(image.image_url) && seen.add(image.image_url))
    .slice(0, 7)
    .map((image) => ({ key: `variant-${image.id}`, src: image.image_url }));
  return [main, ...variants];
}
