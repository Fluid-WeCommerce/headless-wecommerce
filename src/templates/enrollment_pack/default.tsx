import { FluidImage } from "@/components/FluidImage";
import { RichText } from "@/components/RichText";
import { EnrollButton } from "@/components/cart/EnrollButton";

import type { TemplateProps } from "../types";

export default function EnrollmentPackDefault({ enrollmentPack }: TemplateProps["enrollment_pack"]) {
  return (
    <section className="page-width grid gap-10 py-12 lg:grid-cols-2 lg:gap-16">
      <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
        <FluidImage
          images={enrollmentPack.images}
          src={enrollmentPack.image_url}
          alt={enrollmentPack.title}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-6">
        {enrollmentPack.member_type ? (
          <p className="text-sm uppercase tracking-wide text-muted">Join as a {enrollmentPack.member_type.name}</p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{enrollmentPack.title}</h1>
        {enrollmentPack.enrollment_fee && Number(enrollmentPack.enrollment_fee) > 0 ? (
          <p className="text-lg">Enrollment fee: {enrollmentPack.enrollment_fee}</p>
        ) : null}
        <EnrollButton enrollmentPackId={enrollmentPack.id} />
        <RichText html={enrollmentPack.description} className="border-t border-border pt-6" />
      </div>
    </section>
  );
}
