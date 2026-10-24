/**
 * Types for Fluid's public storefront API (v2026-04).
 *
 * They mirror `apps/rails/docs/openapi/storefront-v2026-04.yaml` in the Fluid
 * monorepo. Only fields the template reads are required; everything else is
 * optional so additive API changes never break the build.
 */

export interface ImageRendition {
  url: string;
  width: number;
}

/** Three ImageKit renditions (200/600/1200 wide), or null without an image. */
export interface ResponsiveImageSet {
  thumb?: ImageRendition;
  medium?: ImageRendition;
  large?: ImageRendition;
}

export interface Seo {
  title: string;
  description: string;
  image_url: string;
  /** False for drafts, scheduled or inactive records and for noindex resources. */
  indexable: boolean;
}

export interface Metafield {
  namespace: string;
  key: string;
  value: unknown;
  value_type: string;
}

export type PublishStatus = "draft" | "scheduled" | "published" | "archived";

/** Fields every storefront resource shares. */
export interface ResourceBase {
  id: number;
  slug: string | null;
  title: string;
  description?: string | null;
  image_url?: string | null;
  /** The record's page on the Fluid-hosted storefront. */
  canonical_url: string;
  images: ResponsiveImageSet | null;
  active: boolean;
  status: PublishStatus;
  seo?: Seo;
  metafields?: Metafield[];
  /** ISO 639-1 codes the record is translated into. */
  languages?: string[];
  /** ISO-2 country codes the record is limited to; empty means everywhere. */
  countries?: string[];
  /**
   * The Fluid theme template assigned to this record, or null for the theme
   * default. Returned by show endpoints only; when the API does not return
   * it, it is read from the company API (see company.ts).
   */
  template_id?: number | null;
}

export interface Pricing {
  price: string | null;
  currency_code: string | null;
  compare_at: string | null;
  subscription_price: string | null;
  /** Localized, ready-to-render price such as "$29.99". */
  display_price: string | null;
}

export interface VariantCountry {
  active: boolean;
  currency_code: string;
  price: string;
  compare_price?: string | null;
  subscription_price?: string | null;
  display_price?: string;
  buyable?: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string | null;
  is_master: boolean;
  title: string | null;
  display_name?: string | null;
  image_url?: string | null;
  position?: number | null;
  subscription_only?: boolean;
  allow_subscription?: boolean;
  inventory_quantity?: number | null;
  track_quantity?: boolean;
  keep_selling?: boolean;
  /** Option values in option order, e.g. ["12 oz", "Original"]. */
  option_attrs?: string[];
  images?: { id: number; image_url: string; position: number }[];
  /** Retail pricing keyed by ISO-2 country code. */
  variant_countries?: Record<string, VariantCountry>;
}

export interface ProductSubscriptionPlan {
  id: number;
  default: boolean;
  active: boolean;
  subscription_plan: {
    id: number;
    name: string;
    billing_frequency_in_words?: string;
    subscription_price?: string;
    savings_label?: string;
  };
}

export interface ProductMedium {
  id: number;
  slug: string;
  title: string;
  kind: string | null;
  image_url: string | null;
  video_url: string | null;
  canonical_url: string;
}

/** A product as it appears in lists: no description, variants or SEO. */
export interface ProductCard extends ResourceBase {
  sku: string | null;
  is_bundle: boolean;
  in_stock: boolean;
  has_subscription_plans: boolean;
  pricing: Pricing | null;
  default_variant: { id: number; sku: string | null } | null;
}

export interface Product extends ProductCard {
  variants: ProductVariant[];
  subscription_plans: ProductSubscriptionPlan[];
  media: ProductMedium[];
  bundle_groups: unknown[];
}

export interface EnrollmentPack extends ResourceBase {
  enrollment_fee: string | null;
  additional_volume?: number | null;
  membership_optional?: boolean;
  member_type?: { id: string; slug: string; name: string } | null;
  member_enrollable_products?: { product_id: number; variant_id: number }[];
  subscription_enrollable_products?: {
    product_id: number;
    variant_id: number;
    subscription_plan_id: number;
  }[];
  enrollment_pack_agreements?: { agreement_id: number; required: boolean; position: number }[];
}

export interface MediumCta {
  enabled: boolean;
  action: string;
  url: string | null;
  label: string | null;
  description?: string | null;
  color?: string | null;
}

export interface Medium extends ResourceBase {
  media_type: string | null;
  kind: string | null;
  media_format?: string | null;
  video_url: string | null;
  pdf_url: string | null;
  powerpoint_url: string | null;
  duration: number | null;
  tags?: string[];
  cta?: MediumCta | null;
}

export interface Playlist extends ResourceBase {
  kind: string;
  total_items_count: number;
  library_items: {
    id: number;
    relateable_type: "Medium" | "Product" | "EnrollmentPack" | string;
    relateable_id: number;
    order: number;
  }[];
}

/** Pages expose metadata only: the page body stays on the Fluid storefront. */
export type Page = ResourceBase;

export interface Post extends ResourceBase {
  summary: string | null;
  post_date: string | null;
  post_author: string | null;
  category_id: number | null;
  collection_ids?: number[];
}

export type Collection = ResourceBase;

export interface Category extends ResourceBase {
  parent_id: number | null;
  position: number | null;
  has_children: boolean;
}

export interface Pagination {
  cursor: string | null;
  next_cursor: string | null;
  prev_cursor: string | null;
  limit: number;
}

export interface ListResult<T> {
  items: T[];
  pagination: Pagination;
}

/** Brand and market settings from Fluid's public settings endpoint. */
export interface Shop {
  name: string;
  /** CSS hex color, e.g. `#3a327f`. */
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
  iconUrl: string | null;
  /** ISO-2 country codes, the company default first. */
  countries: string[];
  /** ISO 639-1 language codes, the company default first. */
  languages: string[];
}

export interface MenuItem {
  id: number;
  title: string;
  url: string | null;
  order: number;
  linkable_type: string | null;
  sub_menu_items: MenuItem[];
}

export interface Menu {
  id: number;
  slug: string;
  title: string;
  active: boolean;
  menu_items: MenuItem[];
}
