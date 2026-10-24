import { SiteLink } from "@/components/SiteLink";

import { ResourceCard } from "@/components/ResourceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { resourcePath } from "@/lib/fluid/resources";
import { Hero } from "@/sections/Hero";
import { ProductGrid } from "@/sections/ProductGrid";

import type { TemplateProps } from "../types";

export default function HomePageDefault({ shop, featured, collections, posts }: TemplateProps["home_page"]) {
  return (
    <>
      <Hero title={shop.name} cta={{ label: "Shop now", href: "/shop" }} />

      {featured.length ? (
        <section className="page-width py-16">
          <SectionHeading title="Featured products">
            <SiteLink href="/shop" className="text-sm font-medium underline">
              View all
            </SiteLink>
          </SectionHeading>
          <ProductGrid products={featured} />
        </section>
      ) : null}

      {collections.length ? (
        <section className="page-width py-16">
          <SectionHeading title="Collections" />
          <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {collections.map((collection) => (
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
        </section>
      ) : null}

      {posts.length ? (
        <section className="page-width py-16">
          <SectionHeading title="From the blog">
            <SiteLink href="/blog" className="text-sm font-medium underline">
              All posts
            </SiteLink>
          </SectionHeading>
          <ul className="grid gap-8 sm:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <ResourceCard
                  href={resourcePath("post", post.slug)}
                  title={post.title}
                  images={post.images}
                  imageUrl={post.image_url}
                  aspect="wide"
                >
                  {post.summary ? <p className="line-clamp-2 text-sm text-muted">{post.summary}</p> : null}
                </ResourceCard>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
