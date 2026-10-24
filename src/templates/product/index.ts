import { defineTemplates } from "../types";
import ProductDefault from "./default";
// import ProductLanding from "./landing";

/**
 * Product templates, keyed by Fluid template ID.
 *
 * Products use `default` unless Fluid assigns them another template. To add
 * one, build a component in this folder and register it under the ID of the
 * product template you created in Fluid (Admin → Online Store → Themes):
 *
 *   export default defineTemplates<"product">({
 *     default: ProductDefault,
 *     4821: ProductLanding,
 *   });
 */
export default defineTemplates<"product">({
  default: ProductDefault,
});
