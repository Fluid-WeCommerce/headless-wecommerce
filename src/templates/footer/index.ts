import { defineTemplates } from "../types";
import FooterDefault from "./default";

/**
 * Footer templates. Fluid has one footer template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"footer">({
  default: FooterDefault,
});
