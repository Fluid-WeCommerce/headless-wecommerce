import { buttonClass } from "@/components/Button";
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
      <section className="page-width space-y-20">
        <form action={sitePath(credit, "/search")} className="flex max-w-2xl gap-3">
          <label htmlFor="search-q" className="sr-only">
            Search
          </label>
          <input
            id="search-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search the store"
            className="h-12 min-w-0 rounded-sm border border-border bg-background px-4 text-[15px] placeholder:text-muted focus:border-foreground focus:outline-none flex-1"
          />
          <button type="submit" className={buttonClass("primary")}>
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
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
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
