import { FluidImage } from "@/components/FluidImage";
import { RichText } from "@/components/RichText";
import { languageTag } from "@/lib/fluid/locale";

import type { TemplateProps } from "../types";

export default function PostDefault({ post, locale }: TemplateProps["post"]) {
  const date = post.post_date
    ? new Intl.DateTimeFormat(languageTag(locale), { dateStyle: "long" }).format(new Date(post.post_date))
    : null;

  return (
    <article className="page-width max-w-3xl py-12">
      <header className="space-y-3">
        {date || post.post_author ? (
          <p className="text-sm text-muted">{[date, post.post_author].filter(Boolean).join(" · ")}</p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
        {post.summary ? <p className="text-lg text-muted">{post.summary}</p> : null}
      </header>
      {post.images || post.image_url ? (
        <FluidImage images={post.images} src={post.image_url} alt="" priority className="mt-8 w-full rounded-2xl" />
      ) : null}
      <RichText html={post.description} className="mt-10" />
    </article>
  );
}
