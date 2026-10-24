import { ButtonLink } from "@/components/Button";
import { FluidImage } from "@/components/FluidImage";
import type { Medium } from "@/lib/fluid/types";

/** Plays or shows a Fluid medium: video, PDF, slide deck or image. */
export function MediaPlayer({ medium }: { medium: Medium }) {
  if (medium.video_url) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={medium.images?.large?.url ?? medium.image_url ?? undefined}
        className="aspect-video w-full rounded-2xl bg-black"
      >
        <source src={medium.video_url} />
      </video>
    );
  }

  if (medium.pdf_url) {
    return <iframe src={medium.pdf_url} title={medium.title} className="aspect-[3/4] w-full rounded-2xl border border-border" />;
  }

  return (
    <div className="space-y-4">
      <FluidImage
        images={medium.images}
        src={medium.image_url}
        alt={medium.title}
        priority
        className="w-full rounded-2xl"
      />
      {medium.powerpoint_url ? (
        <ButtonLink href={medium.powerpoint_url} variant="secondary">
          Download slides
        </ButtonLink>
      ) : null}
    </div>
  );
}
