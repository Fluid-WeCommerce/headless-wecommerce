import { ResourceCard } from "@/components/ResourceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { resourcePath } from "@/lib/fluid/resources";
import { sitePath } from "@/lib/fluid/routes";
import { PageHeader } from "@/sections/PageHeader";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function SearchPageDefault({ credit, q, products, collections, categories, posts }: TemplateProps["search_page"]) {
  const others = [
    ...collections.map((record) => ({ ...record, href: resourcePath("collection", record.slug), kind: "Collection" })),
    ...categories.map((record) => ({ ...record, href: resourcePath("category", record.slug), kind: "Category" })),
    ...posts.map((record) => ({ ...record, href: resourcePath("post", record.slug), kind: "Blog" })),
  ];

  return (
    <>
      <PageHeader title={q ? `Results for “${q}”` : "Search"} />
      <section className="page-width space-y-16 pb-16">
        <form action={sitePath(credit, "/search")} className="flex gap-3">
          <label htmlFor="search-q" className="sr-only">
            Search
          </label>
          <input
            id="search-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search the store"
            className="min-w-0 flex-1 rounded-full border border-border px-4 py-2"
          />
          <button type="submit" className="rounded-full bg-brand px-6 py-2 text-white">
            Search
          </button>
        </form>

        {q ? (
          <>
            <div>
              <SectionHeading title="Products" />
              <ProductGrid products={products} empty="No products match your search." />
            </div>
            {others.length ? (
              <div>
                <SectionHeading title="More results" />
                <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {others.map((record) => (
                    <li key={`${record.kind}-${record.id}`}>
                      <ResourceCard
                        href={record.href}
                        title={record.title}
                        images={record.images}
                        imageUrl={record.image_url}
                        eyebrow={record.kind}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  );
}
