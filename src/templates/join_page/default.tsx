import { ResourceCard } from "@/components/ResourceCard";
import { resourcePath } from "@/lib/fluid/resources";
import { PageHeader } from "@/sections/PageHeader";

import type { TemplateProps } from "../types";

export default function JoinPageDefault({ shop, enrollmentPacks }: TemplateProps["join_page"]) {
  return (
    <>
      <PageHeader title={`Join ${shop.name}`} description="Choose the enrollment pack that's right for you." />
      <section className="page-width pb-16">
        {enrollmentPacks.length ? (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {enrollmentPacks.map((pack) => (
              <li key={pack.id}>
                <ResourceCard
                  href={resourcePath("enrollment_pack", pack.slug)}
                  title={pack.title}
                  images={pack.images}
                  imageUrl={pack.image_url}
                  eyebrow={pack.member_type?.name}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center text-muted">Enrollment is not open right now.</p>
        )}
      </section>
    </>
  );
}
