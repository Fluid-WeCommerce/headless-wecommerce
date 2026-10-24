import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function CollectionPageDefault({ collections }: TemplateProps["collection_page"]) {
  return (
    <>
      <PageHeader title="Collections" />
      <section className="page-width pb-16">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {collections.items.map((collection) => (
            <li key={collection.id}>
              <ResourceCard
                href={resourcePath("collection", collection.slug)}
                title={collection.title}
                images={collection.images}
                imageUrl={collection.image_url}
              />
            </li>
          ))}
        </ul>
        <Pagination basePath="/collections" pagination={collections.pagination} />
      </section>
    </>
  );
}
