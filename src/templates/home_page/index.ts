import { defineTemplates } from "../types";
import HomePageDefault from "./default";

/**
 * HomePage templates. Fluid has one home_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"home_page">({
  default: HomePageDefault,
});
