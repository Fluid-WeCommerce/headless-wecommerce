import { defineTemplates } from "../types";
import ShopPageDefault from "./default";

/**
 * ShopPage templates. Fluid has one shop_page template per theme (no
 * per-record assignment), so only `default` is used. Edit ./default.tsx.
 */
export default defineTemplates<"shop_page">({
  default: ShopPageDefault,
});
