import { FluidImage } from "@/components/FluidImage";
import { RichText } from "@/components/RichText";
import { EnrollButton } from "@/components/cart/EnrollButton";

import type { TemplateProps } from "../types";

export default function EnrollmentPackDefault({ enrollmentPack }: TemplateProps["enrollment_pack"]) {
  return (
    <section className="page-width grid gap-10 py-10 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <div className="aspect-square overflow-hidden rounded-sm bg-surface">
        <FluidImage
          images={enrollmentPack.images}
          src={enrollmentPack.image_url}
          alt={enrollmentPack.title}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        {enrollmentPack.member_type ? (
          <p className="text-sm font-medium uppercase tracking-wider text-muted">Join as a {enrollmentPack.member_type.name}</p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{enrollmentPack.title}</h1>
        {enrollmentPack.enrollment_fee && Number(enrollmentPack.enrollment_fee) > 0 ? (
          <p className="text-2xl">{enrollmentPack.enrollment_fee} <span className="text-base text-muted">enrollment fee</span></p>
        ) : null}
        <EnrollButton enrollmentPackId={enrollmentPack.id} />
        <RichText html={enrollmentPack.description} className="border-t border-border pt-8 text-[15px] text-muted" />
      </div>
    </section>
  );
}
