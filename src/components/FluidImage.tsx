import type { ResponsiveImageSet } from "@/lib/fluid/types";

interface FluidImageProps {
  images?: ResponsiveImageSet | null;
  src?: string | null;
  alt: string;
  /** The `sizes` attribute; defaults to a full-width image. */
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * An image from Fluid. Fluid already serves resized, format-negotiated
 * renditions from ImageKit (200, 600 and 1200 wide), so they go straight
 * into `srcset` instead of through the Next.js image optimizer.
 */
export function FluidImage({ images, src, alt, sizes = "100vw", className, priority }: FluidImageProps) {
  const renditions = [images?.thumb, images?.medium, images?.large].filter(
    (rendition): rendition is NonNullable<typeof rendition> => Boolean(rendition?.url),
  );
  const fallback = images?.large?.url ?? images?.medium?.url ?? src;

  if (!fallback) {
    return <div aria-hidden className={`bg-surface ${className ?? ""}`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Fluid renditions are already optimized.
    <img
      src={fallback}
      srcSet={renditions.length ? renditions.map((r) => `${r.url} ${r.width}w`).join(", ") : undefined}
      sizes={renditions.length ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
