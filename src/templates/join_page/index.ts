import { defineTemplates } from "../types";
import JoinPageDefault from "./default";

/**
 * JoinPage templates. Fluid has one join_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"join_page">({
  default: JoinPageDefault,
});
