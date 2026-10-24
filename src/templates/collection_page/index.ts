import { defineTemplates } from "../types";
import CollectionPageDefault from "./default";

/**
 * CollectionPage templates. Fluid has one collection_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"collection_page">({
  default: CollectionPageDefault,
});
