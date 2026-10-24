import type { Pagination as PaginationData } from "@/lib/fluid/types";

import { ButtonLink } from "./Button";

/**
 * Previous/next links for a Fluid list. Fluid pages with cursors rather
 * than page numbers, so each link carries the cursor of the page it opens.
 */
export function Pagination({
  basePath,
  pagination,
  params,
}: {
  basePath: string;
  pagination: PaginationData;
  /** Query params to keep, such as the search term or sort. */
  params?: Record<string, string | undefined>;
}) {
  const { prev_cursor: prev, next_cursor: next } = pagination;
  if (!prev && !next) return null;

  const href = (cursor: string | null) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) if (value) search.set(key, value);
    if (cursor) search.set("cursor", cursor);
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav aria-label="Pagination" className="mt-12 flex justify-center gap-3">
      {prev ? (
        <ButtonLink href={href(prev)} variant="secondary" rel="prev">
          Previous
        </ButtonLink>
      ) : null}
      {next ? (
        <ButtonLink href={href(next)} variant="secondary" rel="next">
          Next
        </ButtonLink>
      ) : null}
    </nav>
  );
}
