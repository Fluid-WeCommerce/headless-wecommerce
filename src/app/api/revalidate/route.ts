import { revalidateTag } from "next/cache";

/**
 * On-demand revalidation, so changes in Fluid show up before the cache
 * expires. Point a Fluid webhook (or anything else) at:
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "tags": ["fluid:product:beet-blend"] }   // optional; defaults to everything
 *
 * Tags: `fluid` (everything), `fluid:<type>` (e.g. `fluid:product`),
 * `fluid:<type>:<slug>`, `fluid:shop` and `fluid:menus`.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return Response.json({ error: "REVALIDATE_SECRET is not set" }, { status: 501 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => ({}));
  const requested = typeof body === "object" && body && "tags" in body && Array.isArray(body.tags) ? body.tags : ["fluid"];
  const tags = requested.filter((tag): tag is string => typeof tag === "string" && tag.startsWith("fluid"));

  for (const tag of tags) revalidateTag(tag, "max");
  return Response.json({ revalidated: tags });
}
