import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import type { CSSProperties } from "react";

import "../globals.css";

import { JsonLd } from "@/components/JsonLd";
import { FairshareProvider } from "@/lib/fairshare/FairshareProvider";
import { DEFAULT_SDK_URL } from "@/lib/fairshare/sdk";
import { fluidConfig, siteUrl } from "@/lib/fluid/config";
import { languageTag } from "@/lib/fluid/locale";
import type { Shop } from "@/lib/fluid/types";
import { pageContext } from "@/lib/page";
import { organizationJsonLd } from "@/lib/structured-data";

/** The base theme's typeface. */
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" });

/** Each language/country pair is rendered on first request, then cached. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { shop } = await pageContext(params);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: shop.name, template: `%s | ${shop.name}` },
    applicationName: shop.name,
    icons: shop.iconUrl ? { icon: shop.iconUrl, apple: shop.iconUrl } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { shop, locale } = await pageContext(params);
  const fluid = fluidConfig();

  return (
    <html lang={languageTag(locale)} style={brandStyle(shop)} className={roboto.variable}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationJsonLd(shop, siteUrl())} />
        {children}
        <FairshareProvider
          src={process.env.FLUID_SDK_URL ?? DEFAULT_SDK_URL}
          config={{
            fluidShop: fluid.shop,
            apiEndpoint: fluid.apiUrl,
            language: locale.language,
            country: locale.country,
          }}
        />
      </body>
    </html>
  );
}

/** The company's colors from Fluid admin, as the theme's CSS variables. */
function brandStyle(shop: Shop): CSSProperties {
  const style: Record<string, string> = {};
  if (shop.primaryColor) {
    style["--brand"] = shop.primaryColor;
    style["--brand-contrast"] = contrastColor(shop.primaryColor);
  }
  if (shop.secondaryColor) style["--brand-secondary"] = shop.secondaryColor;
  return style as CSSProperties;
}

/** Black or white, whichever reads better on `hex` (WCAG relative luminance). */
function contrastColor(hex: string): string {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value;
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((i) => {
    const channel = parseInt(full.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#000000" : "#ffffff";
}
