import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/fluid/config";
import { loadRecord, recordMetadata } from "@/lib/page";
import { articleJsonLd } from "@/lib/structured-data";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/[credit]/blog/[slug]">) {
  return recordMetadata("post", params, (post) => ({ type: "article", description: post.summary ?? undefined }));
}

export default async function PostRoute({ params }: PageProps<"/[locale]/[credit]/blog/[slug]">) {
  const { context, record: post, path } = await loadRecord("post", params);
  return (
    <>
      <JsonLd data={articleJsonLd(post, `${siteUrl()}${path}`, context.shop)} />
      {renderTemplate("post", post.slug, { ...context, post })}
    </>
  );
}
