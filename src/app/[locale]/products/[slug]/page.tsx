import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/fluid/config";
import { listProducts } from "@/lib/fluid/storefront";
import { loadRecord, recordMetadata } from "@/lib/page";
import { productJsonLd } from "@/lib/structured-data";
import { renderTemplate } from "@/templates/registry";

export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">) {
  return recordMetadata("product", params, (product) => ({
    other: product.pricing?.price
      ? {
          "product:price:amount": product.pricing.price,
          "product:price:currency": product.pricing.currency_code ?? "",
          "product:availability": product.in_stock ? "in stock" : "out of stock",
        }
      : undefined,
  }));
}

export default async function ProductRoute({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { context, record: product, templateId, path } = await loadRecord("product", params);
  const others = await listProducts({ locale: context.locale, limit: 5 });

  return (
    <>
      <JsonLd data={productJsonLd(product, `${siteUrl()}${path}`, context.shop)} />
      {renderTemplate("product", templateId, {
        ...context,
        product,
        related: others.items.filter((candidate) => candidate.id !== product.id).slice(0, 4),
      })}
    </>
  );
}
