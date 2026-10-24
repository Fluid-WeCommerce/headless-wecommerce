import { ButtonLink } from "@/components/Button";

/** What a list shows when it has nothing in it. */
export function EmptyState({ title, text, action }: { title: string; text?: string; action?: { label: string; href: string } }) {
  return (
    <div className="rounded-sm bg-surface px-6 py-20 text-center">
      <p className="text-xl font-bold tracking-tight">{title}</p>
      {text ? <p className="mx-auto mt-2 max-w-md text-muted">{text}</p> : null}
      {action ? (
        <ButtonLink href={action.href} variant="secondary" className="mt-8">
          {action.label}
        </ButtonLink>
      ) : null}
    </div>
  );
}
