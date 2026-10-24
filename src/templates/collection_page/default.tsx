import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { EmptyState } from "@/sections/EmptyState";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function CollectionPageDefault({ collections }: TemplateProps["collection_page"]) {
  return (
    <>
      <PageHeader eyebrow="Explore" title="Collections" />
      <section className="page-width">
        {collections.items.length ? null : <EmptyState title="Nothing here yet" text="Check back soon." action={{ label: "Shop all products", href: "/shop" }} />}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {collections.items.map((collection) => (
            <li key={collection.id}>
              <ResourceCard
                href={resourcePath("collection", collection.slug)}
                title={collection.title}
                images={collection.images}
                imageUrl={collection.image_url}
                aspect="portrait"
              />
            </li>
          ))}
        </ul>
        <Pagination basePath="/collections" pagination={collections.pagination} />
      </section>
    </>
  );
}
