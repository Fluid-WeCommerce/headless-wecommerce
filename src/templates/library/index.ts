import { defineTemplates } from "../types";
import LibraryDefault from "./default";

/** Library templates, keyed by slug. See templates/product/index.ts. */
export default defineTemplates<"library">({
  default: LibraryDefault,
});
