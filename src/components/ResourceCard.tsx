import type { ReactNode } from "react";

import type { ResponsiveImageSet } from "@/lib/fluid/types";

import { FluidImage } from "./FluidImage";
import { SiteLink } from "./SiteLink";

interface ResourceCardProps {
  href: string;
  title: string;
  images?: ResponsiveImageSet | null;
  imageUrl?: string | null;
  eyebrow?: ReactNode;
  /** Shown over the image's top-left corner, such as "Sold out". */
  badge?: ReactNode;
  children?: ReactNode;
  aspect?: "square" | "wide" | "portrait";
}

const ASPECTS = { square: "aspect-square", wide: "aspect-[3/2]", portrait: "aspect-[4/5]" } as const;

/**
 * A linked card for any Fluid record: products, collections, posts, media.
 * Records without an image get a tile with their initial, so grids never
 * show empty gray boxes.
 */
export function ResourceCard({ href, title, images, imageUrl, eyebrow, badge, children, aspect = "square" }: ResourceCardProps) {
  const hasImage = Boolean(images?.large || images?.medium || imageUrl);

  return (
    <SiteLink href={href} className="group block">
      <div className={`relative overflow-hidden rounded-sm bg-surface ${ASPECTS[aspect]}`}>
        {hasImage ? (
          <FluidImage
            images={images}
            src={imageUrl}
            alt={title}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center bg-inverse text-inverse-foreground transition-colors group-hover:bg-brand group-hover:text-brand-contrast"
          >
            <span className="text-6xl font-bold tracking-tighter sm:text-7xl">{title.trim().charAt(0).toUpperCase()}</span>
          </div>
        )}
        {badge ? (
          <span className="absolute left-3 top-3 rounded-sm bg-background px-2 py-1 text-xs font-medium">{badge}</span>
        ) : null}
      </div>
      <div className="mt-4 space-y-1.5">
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-wider text-muted">{eyebrow}</p> : null}
        <h3 className="text-[15px] font-medium leading-snug underline-offset-4 group-hover:underline sm:text-base">{title}</h3>
        {children}
      </div>
    </SiteLink>
  );
}
