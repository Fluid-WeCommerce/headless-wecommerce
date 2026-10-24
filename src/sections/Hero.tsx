import { ButtonLink } from "@/components/Button";
import { FluidImage } from "@/components/FluidImage";
import type { ResponsiveImageSet } from "@/lib/fluid/types";

interface HeroImage {
  images?: ResponsiveImageSet | null;
  imageUrl?: string | null;
  alt?: string;
}

/**
 * A dark hero, after the base theme's: a large headline, text and up to two
 * buttons. With one image it fills the background; with several, they sit
 * beside the copy as a grid of tiles.
 */
export function Hero({
  title,
  text,
  images = [],
  actions = [],
}: {
  title: string;
  text?: string | null;
  images?: HeroImage[];
  actions?: { label: string; href: string }[];
}) {
  const [background] = images.length === 1 ? images : [];
  const tiles = images.length > 1 ? images.slice(0, 4) : [];

  return (
    <section className="relative isolate overflow-hidden bg-inverse text-inverse-foreground">
      {background ? (
        <>
          <FluidImage
            images={background.images}
            src={background.imageUrl}
            alt=""
            priority
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        </>
      ) : null}
      <div
        className={`page-width grid items-center gap-12 py-20 sm:py-28 lg:min-h-[38rem] ${tiles.length ? "lg:grid-cols-[1.1fr_1fr] lg:gap-16" : ""}`}
      >
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
          {text ? <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{text}</p> : null}
          {actions.length ? (
            <div className="mt-10 flex flex-wrap gap-4">
              {actions.slice(0, 2).map((action, index) => (
                <ButtonLink key={action.href} href={action.href} variant={index === 0 ? "light" : "outlineLight"}>
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          ) : null}
        </div>
        {tiles.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-sm bg-white ${index % 2 === 1 ? "translate-y-6 sm:translate-y-10" : ""}`}
              >
                <FluidImage
                  images={tile.images}
                  src={tile.imageUrl}
                  alt={tile.alt ?? ""}
                  priority={index < 2}
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
