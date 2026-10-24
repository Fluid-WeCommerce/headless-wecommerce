import { defineTemplates } from "../types";
import EnrollmentPackDefault from "./default";

/** EnrollmentPack templates, keyed by Fluid template ID. See templates/product/index.ts. */
export default defineTemplates<"enrollment_pack">({
  default: EnrollmentPackDefault,
});
