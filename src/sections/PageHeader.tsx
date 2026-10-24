import { RichText } from "@/components/RichText";

/** The title block at the top of list and record pages. */
export function PageHeader({ title, description, html }: { title: string; description?: string | null; html?: boolean }) {
  return (
    <header className="page-width pt-12 pb-8 sm:pt-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description ? (
        html ? (
          <RichText html={description} className="mt-4 max-w-3xl text-muted" />
        ) : (
          <p className="mt-4 max-w-3xl text-muted">{description}</p>
        )
      ) : null}
    </header>
  );
}
