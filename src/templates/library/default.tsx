import { FluidImage } from "@/components/FluidImage";
import { RichText } from "@/components/RichText";

import type { TemplateProps } from "../types";

/**
 * A Fluid library (playlist). The public API lists a playlist's items by
 * record ID only, so this template shows the playlist itself; build a
 * richer one if your libraries are central to the storefront.
 */
export default function LibraryDefault({ library }: TemplateProps["library"]) {
  return (
    <article className="page-width max-w-4xl py-12">
      <FluidImage images={library.images} src={library.image_url} alt="" priority className="aspect-video w-full rounded-2xl object-cover" />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">{library.title}</h1>
      <p className="mt-2 text-sm text-muted">{library.total_items_count} items</p>
      <RichText html={library.description} className="mt-6" />
    </article>
  );
}
