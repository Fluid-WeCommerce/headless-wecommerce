import { RichText } from "@/components/RichText";
import { SiteLink } from "@/components/SiteLink";
import type { Product } from "@/lib/fluid/types";

import { ProductForm } from "./ProductForm";
import { ProductGallery } from "./ProductGallery";

/** The main product section: gallery, title, price, options and description. */
export function MainProduct({ product, country }: { product: Product; country: string }) {
  return (
    <section className="page-width pb-8 pt-6 sm:pt-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted sm:mb-8">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <SiteLink href="/" className="hover:text-foreground">
              Home
            </SiteLink>
          </li>
          <li aria-hidden>/</li>
          <li>
            <SiteLink href="/shop" className="hover:text-foreground">
              Shop
            </SiteLink>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="line-clamp-1 text-foreground">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <ProductGallery product={product} />
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{product.title}</h1>
          <ProductForm product={product} country={country} />
          {product.description ? (
            <details open className="group mt-10 border-t border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                Description
                <span aria-hidden className="text-2xl font-normal leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <RichText html={product.description} className="pb-6 text-[15px] text-muted" />
            </details>
          ) : null}
        </div>
      </div>
    </section>
  );
}
