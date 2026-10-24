import type { Metadata } from "next";

import { NO_CREDIT } from "@/lib/fluid/routes";
import { getShop } from "@/lib/fluid/shop";
import { renderTemplate } from "@/templates/registry";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const shop = await getShop();
  return renderTemplate("error_page", null, {
    shop,
    locale: { language: shop.languages[0] ?? "en", country: shop.countries[0] ?? "US" },
    credit: NO_CREDIT,
  });
}
