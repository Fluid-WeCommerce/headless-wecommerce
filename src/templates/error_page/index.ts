import { defineTemplates } from "../types";
import ErrorPageDefault from "./default";

/**
 * ErrorPage templates. Fluid has one error_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"error_page">({
  default: ErrorPageDefault,
});
