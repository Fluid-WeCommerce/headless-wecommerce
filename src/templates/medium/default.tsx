import { ButtonLink } from "@/components/Button";
import { RichText } from "@/components/RichText";
import { MediaPlayer } from "@/sections/MediaPlayer";

import type { TemplateProps } from "../types";

export default function MediumDefault({ medium }: TemplateProps["medium"]) {
  const cta = medium.cta?.enabled && medium.cta.url ? medium.cta : null;
  return (
    <article className="page-width max-w-5xl py-10 sm:py-16">
      <MediaPlayer medium={medium} />
      <h1 className="mt-10 text-3xl font-bold tracking-tight sm:text-5xl">{medium.title}</h1>
      <RichText html={medium.description} className="mt-6 max-w-3xl text-lg text-muted" />
      {cta ? (
        <div className="mt-8 space-y-2">
          <ButtonLink href={cta.url!} style={cta.color ? { backgroundColor: cta.color } : undefined}>
            {cta.label ?? "Learn more"}
          </ButtonLink>
          {cta.description ? <p className="text-sm text-muted">{cta.description}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
