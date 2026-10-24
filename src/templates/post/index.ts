import { defineTemplates } from "../types";
import PostDefault from "./default";

/** Post templates, keyed by slug. See templates/product/index.ts. */
export default defineTemplates<"post">({
  default: PostDefault,
});
