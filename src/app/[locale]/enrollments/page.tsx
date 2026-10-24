import { permanentRedirect } from "next/navigation";

/** Enrollment packs are listed on /join. */
export default function EnrollmentsRoute() {
  permanentRedirect("/join");
}
