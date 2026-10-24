import { SiteLink } from "@/components/SiteLink";
import type { ReactNode } from "react";

import type { ResponsiveImageSet } from "@/lib/fluid/types";

import { FluidImage } from "./FluidImage";

interface ResourceCardProps {
  href: string;
  title: string;
  images?: ResponsiveImageSet | null;
  imageUrl?: string | null;
  eyebrow?: ReactNode;
  children?: ReactNode;
  aspect?: "square" | "wide";
}

/** A linked card for any Fluid record: products, collections, posts, media. */
export function ResourceCard({ href, title, images, imageUrl, eyebrow, children, aspect = "square" }: ResourceCardProps) {
  return (
    <SiteLink href={href} className="group block">
      <div className={`overflow-hidden rounded-xl bg-surface ${aspect === "square" ? "aspect-square" : "aspect-video"}`}>
        <FluidImage
          images={images}
          src={imageUrl}
          alt={title}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 space-y-1">
        {eyebrow ? <p className="text-xs uppercase tracking-wide text-muted">{eyebrow}</p> : null}
        <h3 className="font-medium leading-snug">{title}</h3>
        {children}
      </div>
    </SiteLink>
  );
}
