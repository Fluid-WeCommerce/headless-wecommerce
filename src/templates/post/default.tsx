import { FluidImage } from "@/components/FluidImage";
import { ArrowLeftIcon } from "@/components/icons";
import { RichText } from "@/components/RichText";
import { SiteLink } from "@/components/SiteLink";
import { formatDate } from "@/lib/format";

import type { TemplateProps } from "../types";

export default function PostDefault({ post, locale }: TemplateProps["post"]) {
  const meta = [formatDate(post.post_date, locale), post.post_author].filter(Boolean).join(" · ");

  return (
    <article className="pb-8 pt-10 sm:pt-16">
      <header className="page-width max-w-4xl">
        <SiteLink href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground">
          <ArrowLeftIcon width={16} height={16} />
          All posts
        </SiteLink>
        {meta ? <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">{meta}</p> : null}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
        {post.summary ? <p className="mt-6 text-xl leading-relaxed text-muted">{post.summary}</p> : null}
      </header>
      {post.images || post.image_url ? (
        <div className="page-width mt-12 max-w-6xl">
          <FluidImage images={post.images} src={post.image_url} alt="" priority className="aspect-[2/1] w-full rounded-sm object-cover" />
        </div>
      ) : null}
      <RichText html={post.description} className="page-width mt-12 max-w-3xl text-lg" />
    </article>
  );
}
