import { ButtonLink } from "@/components/Button";

export default function ErrorPageDefault() {
  return (
    <section className="page-width flex flex-col items-center py-28 text-center sm:py-40">
      <p className="text-8xl font-bold tracking-tighter sm:text-9xl">404</p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-muted">The page may have moved, or the link may be out of date.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="secondary">
          Shop all products
        </ButtonLink>
      </div>
    </section>
  );
}
