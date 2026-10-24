import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function CategoryPageDefault({ categories }: TemplateProps["category_page"]) {
  return (
    <>
      <PageHeader title="Categories" />
      <section className="page-width pb-16">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {categories.items.map((category) => (
            <li key={category.id}>
              <ResourceCard
                href={resourcePath("category", category.slug)}
                title={category.title}
                images={category.images}
                imageUrl={category.image_url}
              />
            </li>
          ))}
        </ul>
        <Pagination basePath="/categories" pagination={categories.pagination} />
      </section>
    </>
  );
}
