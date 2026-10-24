import { defineTemplates } from "../types";
import SearchPageDefault from "./default";

/**
 * Search results. This one has no Fluid template type (Fluid's storefront
 * search is a built-in page), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"search_page">({
  default: SearchPageDefault,
});
