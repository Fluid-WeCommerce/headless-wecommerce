import { revalidateSeconds } from "@/config/site";

export class FluidApiError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    readonly body: string,
  ) {
    super(`Fluid API ${status} for ${url}`);
    this.name = "FluidApiError";
  }
}

type QueryValue = string | number | boolean | null | undefined | readonly (string | number)[];
export type Query = Record<string, QueryValue>;

export interface FluidRequest {
  query?: Query;
  method?: "GET" | "POST";
  body?: unknown;
  /** Bearer token for company endpoints. Keep it on the server. */
  token?: string;
  /** Cache tags, revalidated by POST /api/revalidate. `fluid` is always added. */
  tags?: string[];
  /**
   * Seconds to cache the response in the Next.js data cache. Defaults to
   * the site setting; `false` skips the data cache (used by the proxy,
   * which runs outside of rendering).
   */
  revalidate?: number | false;
}

/**
 * Request a Fluid endpoint and parse the JSON body. Returns `null` for a 404
 * so pages can call `notFound()`; every other failure throws.
 */
export async function fluidRequest<T>(url: string, request: FluidRequest = {}): Promise<T | null> {
  const target = withQuery(url, request.query);
  const revalidate = request.revalidate ?? revalidateSeconds;

  const response = await fetch(target, {
    method: request.method ?? "GET",
    headers: {
      accept: "application/json",
      ...(request.body === undefined ? {} : { "content-type": "application/json" }),
      ...(request.token ? { authorization: `Bearer ${request.token}` } : {}),
    },
    body: request.body === undefined ? undefined : JSON.stringify(request.body),
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { cache: "force-cache" as const, next: { revalidate, tags: ["fluid", ...(request.tags ?? [])] } }),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new FluidApiError(response.status, target, await response.text().catch(() => ""));
  }
  return (await response.json()) as T;
}

/**
 * Serialize query params the way Rails expects: arrays become `key[]=a&key[]=b`.
 */
export function withQuery(url: string, query: Query = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(`${key}[]`, String(item));
    } else {
      params.append(key, String(value));
    }
  }
  const search = params.toString();
  return search ? `${url}${url.includes("?") ? "&" : "?"}${search}` : url;
}
