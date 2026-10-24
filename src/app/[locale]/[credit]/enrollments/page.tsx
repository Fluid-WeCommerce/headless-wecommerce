import { permanentRedirect } from "next/navigation";

import { sitePath } from "@/lib/fluid/routes";

/** Enrollment packs are listed on /join. */
export default async function EnrollmentsRoute({ params }: PageProps<"/[locale]/[credit]/enrollments">) {
  permanentRedirect(sitePath((await params).credit, "/join"));
}
