import { defineTemplates } from "../types";
import CategoryDefault from "./default";

/** Category templates, keyed by Fluid template ID. See templates/product/index.ts. */
export default defineTemplates<"category">({
  default: CategoryDefault,
});
