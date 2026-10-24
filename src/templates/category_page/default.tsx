import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { EmptyState } from "@/sections/EmptyState";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function CategoryPageDefault({ categories }: TemplateProps["category_page"]) {
  return (
    <>
      <PageHeader eyebrow="Explore" title="Categories" />
      <section className="page-width">
        {categories.items.length ? null : <EmptyState title="Nothing here yet" text="Check back soon." action={{ label: "Shop all products", href: "/shop" }} />}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {categories.items.map((category) => (
            <li key={category.id}>
              <ResourceCard
                href={resourcePath("category", category.slug)}
                title={category.title}
                images={category.images}
                imageUrl={category.image_url}
                aspect="portrait"
              />
            </li>
          ))}
        </ul>
        <Pagination basePath="/categories" pagination={categories.pagination} />
      </section>
    </>
  );
}
