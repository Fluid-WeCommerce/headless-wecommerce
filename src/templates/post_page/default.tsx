import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/sections/EmptyState";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function PostPageDefault({ posts, locale }: TemplateProps["post_page"]) {
  return (
    <>
      <PageHeader eyebrow="Blog" title="Latest stories" />
      <section className="page-width">
        {posts.items.length ? (
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.items.map((post) => (
              <li key={post.id}>
                <ResourceCard
                  href={resourcePath("post", post.slug)}
                  title={post.title}
                  images={post.images}
                  imageUrl={post.image_url}
                  eyebrow={formatDate(post.post_date, locale)}
                  aspect="wide"
                >
                  {post.summary ? <p className="line-clamp-3 text-[15px] text-muted">{post.summary}</p> : null}
                </ResourceCard>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No posts yet" text="Check back soon for news and stories." />
        )}
        <Pagination basePath="/blog" pagination={posts.pagination} />
      </section>
    </>
  );
}
