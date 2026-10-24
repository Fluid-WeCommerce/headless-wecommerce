import { Pagination } from "@/components/Pagination";
import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function PostPageDefault({ posts }: TemplateProps["post_page"]) {
  return (
    <>
      <PageHeader title="Blog" />
      <section className="page-width pb-16">
        {posts.items.length ? (
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.items.map((post) => (
              <li key={post.id}>
                <ResourceCard
                  href={resourcePath("post", post.slug)}
                  title={post.title}
                  images={post.images}
                  imageUrl={post.image_url}
                  eyebrow={post.post_date}
                  aspect="wide"
                >
                  {post.summary ? <p className="line-clamp-3 text-sm text-muted">{post.summary}</p> : null}
                </ResourceCard>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center text-muted">No posts yet.</p>
        )}
        <Pagination basePath="/blog" pagination={posts.pagination} />
      </section>
    </>
  );
}
