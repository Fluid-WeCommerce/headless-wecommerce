import { defineTemplates } from "../types";
import CollectionDefault from "./default";

/** Collection templates, keyed by Fluid template ID. See templates/product/index.ts. */
export default defineTemplates<"collection">({
  default: CollectionDefault,
});
