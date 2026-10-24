import { defineTemplates } from "../types";
import LibraryDefault from "./default";

/** Library templates, keyed by Fluid template ID. See templates/product/index.ts. */
export default defineTemplates<"library">({
  default: LibraryDefault,
});
