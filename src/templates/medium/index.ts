import { defineTemplates } from "../types";
import MediumDefault from "./default";

/** Medium templates, keyed by slug. See templates/product/index.ts. */
export default defineTemplates<"medium">({
  default: MediumDefault,
});
