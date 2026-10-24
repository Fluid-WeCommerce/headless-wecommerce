import { ButtonLink } from "@/components/Button";

export default function ErrorPageDefault() {
  return (
    <section className="page-width py-32 text-center">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">We couldn&apos;t find that page</h1>
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </section>
  );
}
