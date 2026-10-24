import { FluidImage } from "@/components/FluidImage";
import { ResourceCard } from "@/components/ResourceCard";
import { RichText } from "@/components/RichText";
import { resourcePath, type AnyResource } from "@/lib/fluid/resources";

import type { TemplateProps } from "../types";

const LABELS: Record<AnyResource["type"], string> = {
  product: "Product",
  enrollment_pack: "Enrollment",
  medium: "Media",
  library: "Library",
  page: "Page",
  post: "Article",
  collection: "Collection",
  category: "Category",
};

/** A Fluid library (playlist): its details, then its items in order. */
export default function LibraryDefault({ library, items }: TemplateProps["library"]) {
  return (
    <article className="page-width py-12">
      <div className="max-w-4xl">
        <FluidImage images={library.images} src={library.image_url} alt="" priority className="aspect-video w-full rounded-2xl object-cover" />
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">{library.title}</h1>
        <p className="mt-2 text-sm text-muted">{library.total_items_count} items</p>
        <RichText html={library.description} className="mt-6" />
      </div>
      {items.length > 0 ? (
        <ol className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(({ type, record }) => (
            <li key={`${type}:${record.id}`}>
              <ResourceCard
                href={resourcePath(type, record.slug)}
                title={record.title}
                images={record.images}
                imageUrl={record.image_url}
                eyebrow={LABELS[type]}
              />
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}
