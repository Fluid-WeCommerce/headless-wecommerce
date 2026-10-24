import { createElement, type ReactElement } from "react";

import cart_page from "./cart_page";
import category from "./category";
import category_page from "./category_page";
import collection from "./collection";
import collection_page from "./collection_page";
import enrollment_pack from "./enrollment_pack";
import error_page from "./error_page";
import footer from "./footer";
import home_page from "./home_page";
import join_page from "./join_page";
import library from "./library";
import medium from "./medium";
import navbar from "./navbar";
import page from "./page";
import post from "./post";
import post_page from "./post_page";
import product from "./product";
import search_page from "./search_page";
import shop_page from "./shop_page";
import { templateFor, type TemplateProps, type TemplateSet, type TemplateType } from "./types";

const registry: { [K in TemplateType]: TemplateSet<TemplateProps[K]> } = {
  product,
  enrollment_pack,
  medium,
  library,
  page,
  post,
  collection,
  category,
  home_page,
  shop_page,
  category_page,
  collection_page,
  post_page,
  join_page,
  cart_page,
  search_page,
  error_page,
  navbar,
  footer,
};

/**
 * Render the template for a page: the one registered under the record's
 * slug, or `default`. Pages without a record pass `null`.
 */
export function renderTemplate<K extends TemplateType>(
  type: K,
  slug: string | null | undefined,
  props: TemplateProps[K],
): ReactElement {
  return createElement(templateFor(registry[type], slug), props);
}
