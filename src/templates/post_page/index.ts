import { defineTemplates } from "../types";
import PostPageDefault from "./default";

/**
 * PostPage templates. Fluid has one post_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"post_page">({
  default: PostPageDefault,
});
