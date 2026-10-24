import { defineTemplates } from "../types";
import ProductDefault from "./default";
// import ProductLanding from "./landing";

/**
 * Product templates, keyed by product slug.
 *
 * A product renders with the template registered under its slug, and with
 * `default` otherwise. To give a product its own design, build a component
 * in this folder and register it under the product's slug:
 *
 *   export default defineTemplates<"product">({
 *     default: ProductDefault,
 *     "beet-blend": ProductLanding,
 *   });
 */
export default defineTemplates<"product">({
  default: ProductDefault,
});
