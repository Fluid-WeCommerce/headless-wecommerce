import { SiteLink } from "@/components/SiteLink";
import { sitePath } from "@/lib/fluid/routes";

import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/sections/PageHeader";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

const SORTS = [
  { value: "", label: "Featured" },
  { value: "title", label: "Name, A–Z" },
  { value: "-title", label: "Name, Z–A" },
  { value: "-created_at", label: "Newest" },
];

export default function ShopPageDefault({ credit, products, categories, query }: TemplateProps["shop_page"]) {
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm ${active ? "border-brand bg-brand text-white" : "border-border hover:bg-surface"}`;

  return (
    <>
      <PageHeader title="Shop" />
      <section className="page-width pb-16">
        <form className="mb-8 flex flex-wrap items-center gap-3" action={sitePath(credit, "/shop")}>
          <label htmlFor="shop-q" className="sr-only">
            Search products
          </label>
          <input
            id="shop-q"
            name="q"
            type="search"
            defaultValue={query.q}
            placeholder="Search products"
            className="min-w-0 flex-1 rounded-full border border-border px-4 py-2 text-sm"
          />
          {query.category ? <input type="hidden" name="category" value={query.category} /> : null}
          <label htmlFor="shop-sort" className="sr-only">
            Sort
          </label>
          <select
            id="shop-sort"
            name="sort"
            defaultValue={query.sort ?? ""}
            className="rounded-full border border-border px-4 py-2 text-sm"
          >
            {SORTS.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm text-white">
            Apply
          </button>
        </form>

        {categories.length ? (
          <nav aria-label="Categories" className="mb-10 flex flex-wrap gap-2">
            <SiteLink href="/shop" className={chip(!query.category)}>
              All
            </SiteLink>
            {categories.map((category) => (
              <SiteLink
                key={category.id}
                href={`/shop?category=${encodeURIComponent(category.slug ?? "")}`}
                className={chip(query.category === category.slug)}
              >
                {category.title}
              </SiteLink>
            ))}
          </nav>
        ) : null}

        <ProductGrid products={products.items} />
        <Pagination
          basePath={products.basePath}
          pagination={products.pagination}
          params={{ q: query.q, sort: query.sort, category: query.category }}
        />
      </section>
    </>
  );
}
