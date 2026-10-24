import "server-only";

import { fluidConfig } from "./config";
import { fluidRequest, type Query } from "./http";
import type { Locale } from "./locale";
import { RESOURCES, type ResourceListItem, type ResourceRecord, type ResourceType } from "./resources";
import type { ListResult, Pagination, ProductCard } from "./types";

/**
 * Fluid's public storefront API. It needs no token: the company is
 * identified by the storefront host (`https://<shop>.fluid.app`), so every
 * call is made from the server.
 */
const storefrontApi = () => `${fluidConfig().storefrontUrl}/api/v202604`;

/** Products are priced per country, so their endpoints take `country`. */
const PRICED: ReadonlySet<ResourceType> = new Set(["product"]);

/** Fetch one record by slug, or `null` when it does not exist. */
export async function getResource<T extends ResourceType>(
  type: T,
  slug: string,
  locale: Locale,
): Promise<ResourceRecord[T] | null> {
  const { api, item } = RESOURCES[type];
  const body = await fluidRequest<Record<string, ResourceRecord[T]>>(
    `${storefrontApi()}/${api}/${encodeURIComponent(slug)}`,
    {
      query: { lang: locale.language, country: PRICED.has(type) ? locale.country : undefined },
      tags: [`fluid:${type}`, `fluid:${type}:${slug}`],
    },
  );
  const record = body?.[item];
  return record ? normalizeRecord(record) : null;
}

export interface ListOptions {
  locale: Locale;
  /** `meta.pagination.next_cursor` from the previous page. */
  cursor?: string | null;
  /** 1–100, default 25. */
  limit?: number;
  /** Full-text search. */
  q?: string;
  /** A sort key such as `title` or `-created_at`. */
  sort?: string;
  /** Extra filters, e.g. `{ "filter[media_type]": "share" }`. */
  filter?: Query;
}

/** List live records of a type in the visitor's language and country. */
export async function listResources<T extends ResourceType>(
  type: T,
  options: ListOptions,
): Promise<ListResult<ResourceListItem[T]>> {
  const { api, list } = RESOURCES[type];
  return fetchList<ResourceListItem[T]>(`${storefrontApi()}/${api}`, list, type, options);
}

export interface ProductListOptions extends ListOptions {
  categoryIds?: number[];
  collectionIds?: number[];
  inStockOnly?: boolean;
}

export function listProducts(options: ProductListOptions): Promise<ListResult<ProductCard>> {
  return listResources("product", {
    ...options,
    filter: {
      "filter[category_ids]": options.categoryIds,
      "filter[collection_ids]": options.collectionIds,
      "filter[availability]": options.inStockOnly ? "in_stock" : undefined,
      ...options.filter,
    },
  });
}

/** Products in a category or collection, in the merchant's order. */
export function listProductsIn(
  parent: "category" | "collection",
  slug: string,
  options: ListOptions,
): Promise<ListResult<ProductCard>> {
  return fetchList<ProductCard>(
    `${storefrontApi()}/${RESOURCES[parent].api}/${encodeURIComponent(slug)}/products`,
    "products",
    "product",
    options,
    [`fluid:${parent}:${slug}`],
  );
}

interface ListBody {
  meta?: { pagination?: Pagination };
  [key: string]: unknown;
}

async function fetchList<T>(
  url: string,
  key: string,
  type: ResourceType,
  options: ListOptions,
  extraTags: string[] = [],
): Promise<ListResult<T>> {
  const priced = PRICED.has(type);
  const body = await fluidRequest<ListBody>(url, {
    query: {
      lang: options.locale.language,
      // Products take the country for pricing; other lists filter by it.
      country: priced ? options.locale.country : undefined,
      "filter[country]": priced ? undefined : options.locale.country,
      q: options.q,
      sort: options.sort,
      "page[cursor]": options.cursor,
      "page[limit]": options.limit,
      ...options.filter,
    },
    tags: [`fluid:${type}`, ...extraTags],
  });

  return {
    items: ((body?.[key] as T[] | undefined) ?? []).map(normalizeRecord),
    pagination: body?.meta?.pagination ?? {
      cursor: null,
      next_cursor: null,
      prev_cursor: null,
      limit: options.limit ?? 25,
    },
  };
}

/**
 * Products, media and enrollment packs return `description` as a rich-text
 * object (`{ body: "<p>…</p>", … }`) although the API spec documents a
 * string. Templates always get the HTML string.
 */
export function normalizeRecord<T>(record: T): T {
  const description = (record as { description?: unknown }).description;
  if (description && typeof description === "object" && "body" in description) {
    const { body } = description as { body?: unknown };
    return { ...record, description: typeof body === "string" ? body : null };
  }
  return record;
}
