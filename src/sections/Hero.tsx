import { ButtonLink } from "@/components/Button";
import { FluidImage } from "@/components/FluidImage";
import type { ResponsiveImageSet } from "@/lib/fluid/types";

export function Hero({
  title,
  text,
  images,
  imageUrl,
  cta,
}: {
  title: string;
  text?: string | null;
  images?: ResponsiveImageSet | null;
  imageUrl?: string | null;
  cta?: { label: string; href: string };
}) {
  const hasImage = Boolean(images || imageUrl);
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      {hasImage ? (
        <FluidImage
          images={images}
          src={imageUrl}
          alt=""
          priority
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
      ) : null}
      <div className="page-width py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          {text ? <p className="mt-6 text-lg text-muted">{text}</p> : null}
          {cta ? (
            <ButtonLink href={cta.href} className="mt-10">
              {cta.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
