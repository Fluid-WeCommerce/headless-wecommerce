import { defineTemplates } from "../types";
import PageDefault from "./default";

/** Page templates, keyed by Fluid template ID. See templates/product/index.ts. */
export default defineTemplates<"page">({
  default: PageDefault,
});
