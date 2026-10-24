import { FluidImage } from "@/components/FluidImage";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

/**
 * A Fluid page. The public API carries a page's title, description, image
 * and metafields but not the page-builder body, so headless pages are where
 * custom templates shine: register one per page template in ./index.ts and
 * build the content in code, reading metafields for editable copy.
 */
export default function PageDefault({ page }: TemplateProps["page"]) {
  return (
    <article className="pb-16">
      <PageHeader title={page.title} description={page.description} html />
      {page.images || page.image_url ? (
        <div className="page-width">
          <FluidImage images={page.images} src={page.image_url} alt="" priority className="w-full rounded-2xl" />
        </div>
      ) : null}
    </article>
  );
}
