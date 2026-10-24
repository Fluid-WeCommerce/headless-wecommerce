import { defineTemplates } from "../types";
import CartPageDefault from "./default";

/**
 * CartPage templates. Fluid has one cart_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"cart_page">({
  default: CartPageDefault,
});
