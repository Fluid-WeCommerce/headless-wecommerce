import { defineTemplates } from "../types";
import NavbarDefault from "./default";

/**
 * Navbar templates. Fluid has one navbar template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"navbar">({
  default: NavbarDefault,
});
