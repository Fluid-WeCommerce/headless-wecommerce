"use client";

import { Button } from "@/components/Button";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="page-width py-28 text-center sm:py-40">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Something went wrong</h1>
      <p className="mt-4 text-muted">The store couldn&apos;t load this page. Please try again.</p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </section>
  );
}
