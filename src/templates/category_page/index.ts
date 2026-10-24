import { defineTemplates } from "../types";
import CategoryPageDefault from "./default";

/**
 * CategoryPage templates. Fluid has one category_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"category_page">({
  default: CategoryPageDefault,
});
