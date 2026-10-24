import { notFound } from "next/navigation";

/** Anything no other route matches renders the error_page template. */
export default function CatchAllRoute() {
  notFound();
}
