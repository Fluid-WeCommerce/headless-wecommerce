import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { EmptyState } from "@/sections/EmptyState";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function JoinPageDefault({ shop, enrollmentPacks }: TemplateProps["join_page"]) {
  return (
    <>
      <PageHeader eyebrow="Join" title={`Join ${shop.name}`} description="Choose the enrollment pack that's right for you." />
      <section className="page-width">
        {enrollmentPacks.length ? (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {enrollmentPacks.map((pack) => (
              <li key={pack.id}>
                <ResourceCard
                  href={resourcePath("enrollment_pack", pack.slug)}
                  title={pack.title}
                  images={pack.images}
                  imageUrl={pack.image_url}
                  eyebrow={pack.member_type?.name}
                  aspect="portrait"
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Enrollment is not open right now" text="Check back soon." />
        )}
      </section>
    </>
  );
}
