import type { ComponentType } from "react";

import type { NavLink } from "@/config/site";
import type { Locale } from "@/lib/fluid/locale";
import type {
  Category,
  Collection,
  EnrollmentPack,
  ListResult,
  Medium,
  Page,
  Playlist,
  Post,
  Product,
  ProductCard,
  Shop,
} from "@/lib/fluid/types";

/** Passed to every template. */
export interface TemplateContext {
  shop: Shop;
  locale: Locale;
}

/** Product listings that page with "load more" links. */
export interface ProductListing extends ListResult<ProductCard> {
  /** Path the next page link points at (the cursor is appended). */
  basePath: string;
}

/**
 * Props for each template type. The keys are Fluid's theme template types
 * (`themeable_type`), so `templates/product` is the headless counterpart of
 * the `product` templates you manage in Fluid admin.
 */
export interface TemplateProps {
  // Records. A record can be assigned any template of its type in Fluid.
  product: TemplateContext & { product: Product; related: ProductCard[] };
  enrollment_pack: TemplateContext & { enrollmentPack: EnrollmentPack };
  medium: TemplateContext & { medium: Medium };
  library: TemplateContext & { library: Playlist };
  page: TemplateContext & { page: Page };
  post: TemplateContext & { post: Post };
  collection: TemplateContext & { collection: Collection; products: ProductListing };
  category: TemplateContext & { category: Category; products: ProductListing };

  // Pages without a record. They always use the default template.
  home_page: TemplateContext & { featured: ProductCard[]; collections: Collection[]; posts: Post[] };
  shop_page: TemplateContext & {
    products: ProductListing;
    categories: Category[];
    query: { q?: string; sort?: string; category?: string };
  };
  category_page: TemplateContext & { categories: ListResult<Category> };
  collection_page: TemplateContext & { collections: ListResult<Collection> };
  post_page: TemplateContext & { posts: ListResult<Post> };
  join_page: TemplateContext & { enrollmentPacks: EnrollmentPack[] };
  cart_page: TemplateContext;
  search_page: TemplateContext & {
    q: string;
    products: ProductCard[];
    collections: Collection[];
    categories: Category[];
    posts: Post[];
  };
  error_page: TemplateContext;

  // Layout pieces.
  navbar: TemplateContext & { links: NavLink[] };
  footer: TemplateContext & { links: NavLink[] };
}

export type TemplateType = keyof TemplateProps;

/**
 * The templates for one type, keyed by Fluid template ID. `default` is used
 * when a record has no template assigned, or one this storefront has not
 * implemented yet.
 */
export type TemplateSet<P> = { default: ComponentType<P> } & { [templateId: string]: ComponentType<P> };

export function defineTemplates<K extends TemplateType>(
  templates: TemplateSet<TemplateProps[K]>,
): TemplateSet<TemplateProps[K]> {
  return templates;
}
