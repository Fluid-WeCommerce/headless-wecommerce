import { ResourceCard } from "@/components/ResourceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { resourcePath } from "@/lib/fluid/resources";
import { formatDate } from "@/lib/format";
import { Hero } from "@/sections/Hero";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function HomePageDefault({ shop, locale, featured, collections, posts }: TemplateProps["home_page"]) {
  const heroImages = featured
    .filter((product) => product.images?.large || product.image_url)
    .slice(0, 4)
    .map((product) => ({ images: product.images, imageUrl: product.image_url, alt: product.title }));

  return (
    <>
      <Hero
        title={shop.name}
        text="Shop our latest products, explore our collections and find something you'll love."
        images={heroImages.length > 1 ? heroImages : []}
        actions={[
          { label: "Shop now", href: "/shop" },
          { label: "Explore collections", href: "/collections" },
        ]}
      />

      {featured.length ? (
        <section className="page-width py-20 sm:py-28">
          <SectionHeading eyebrow="Shop" title="Featured products" link={{ label: "View all", href: "/shop" }} />
          <ProductGrid products={featured} />
        </section>
      ) : null}

      {collections.length ? (
        <section className="bg-surface py-20 sm:py-28">
          <div className="page-width">
            <SectionHeading eyebrow="Explore" title="Collections" link={{ label: "All collections", href: "/collections" }} />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {collections.map((collection) => (
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
          </div>
        </section>
      ) : null}

      {posts.length ? (
        <section className="page-width py-20 sm:py-28">
          <SectionHeading eyebrow="Blog" title="Latest stories" link={{ label: "All posts", href: "/blog" }} />
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <ResourceCard
                  href={resourcePath("post", post.slug)}
                  title={post.title}
                  images={post.images}
                  imageUrl={post.image_url}
                  eyebrow={formatDate(post.post_date, locale)}
                  aspect="wide"
                >
                  {post.summary ? <p className="line-clamp-2 text-[15px] text-muted">{post.summary}</p> : null}
                </ResourceCard>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
