import type {
  Category,
  Collection,
  EnrollmentPack,
  Medium,
  Page,
  Playlist,
  Post,
  Product,
  ProductCard,
} from "./types";

/**
 * Every Fluid record type with its own page. Keys are Fluid's theme template
 * types (`themeable_type`), so they line up with the folders in
 * `src/templates` and with the template types in Fluid admin.
 */
export const RESOURCES = {
  product: { api: "products", item: "product", list: "products", path: "/products" },
  enrollment_pack: {
    api: "enrollment-packs",
    item: "enrollment_pack",
    list: "enrollment_packs",
    path: "/enrollments",
  },
  medium: { api: "media", item: "medium", list: "media", path: "/media" },
  library: { api: "playlists", item: "playlist", list: "playlists", path: "/libraries" },
  page: { api: "pages", item: "page", list: "pages", path: "/pages" },
  post: { api: "posts", item: "post", list: "posts", path: "/blog" },
  collection: { api: "collections", item: "collection", list: "collections", path: "/collections" },
  category: { api: "categories", item: "category", list: "categories", path: "/categories" },
} as const;

export type ResourceType = keyof typeof RESOURCES;

/** The full record returned by each type's show endpoint. */
export interface ResourceRecord {
  product: Product;
  enrollment_pack: EnrollmentPack;
  medium: Medium;
  library: Playlist;
  page: Page;
  post: Post;
  collection: Collection;
  category: Category;
}

/** The (possibly slimmer) record returned by each type's list endpoint. */
export interface ResourceListItem extends Omit<ResourceRecord, "product"> {
  product: ProductCard;
}

/** Path to a record's page on this site: `/products/beet-blend`. */
export function resourcePath(type: ResourceType, slug: string | null | undefined): string {
  return slug ? `${RESOURCES[type].path}/${encodeURIComponent(slug)}` : RESOURCES[type].path;
}
