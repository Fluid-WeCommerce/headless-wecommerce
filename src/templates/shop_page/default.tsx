import { buttonClass } from "@/components/Button";
import { SearchIcon } from "@/components/icons";
import { Pagination } from "@/components/Pagination";
import { SiteLink } from "@/components/SiteLink";
import { sitePath } from "@/lib/fluid/routes";
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
    `inline-flex h-10 items-center rounded-sm border px-4 text-sm font-medium transition-colors ${
      active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
    }`;

  return (
    <>
      <PageHeader eyebrow="Shop" title="All products" />
      <section className="page-width">
        <div className="mb-10 space-y-6 border-b border-border pb-8">
          <form className="flex flex-wrap gap-3" action={sitePath(credit, "/shop")}>
            <div className="relative min-w-60 flex-1">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <label htmlFor="shop-q" className="sr-only">
                Search products
              </label>
              <input
                id="shop-q"
                name="q"
                type="search"
                defaultValue={query.q}
                placeholder="Search products"
                className="h-12 min-w-0 rounded-sm border border-border bg-background px-4 text-[15px] placeholder:text-muted focus:border-foreground focus:outline-none w-full pl-12"
              />
            </div>
            {query.category ? <input type="hidden" name="category" value={query.category} /> : null}
            <label htmlFor="shop-sort" className="sr-only">
              Sort
            </label>
            <select id="shop-sort" name="sort" defaultValue={query.sort ?? ""} className="h-12 min-w-0 rounded-sm border border-border bg-background px-4 text-[15px] placeholder:text-muted focus:border-foreground focus:outline-none">
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
            <button type="submit" className={buttonClass("primary")}>
              Apply
            </button>
          </form>

          {categories.length ? (
            <nav aria-label="Categories" className="flex flex-wrap gap-2">
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
        </div>

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
