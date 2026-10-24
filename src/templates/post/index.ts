import { defineTemplates } from "../types";
import PostDefault from "./default";

/** Post templates, keyed by Fluid template ID. See templates/product/index.ts. */
export default defineTemplates<"post">({
  default: PostDefault,
});
