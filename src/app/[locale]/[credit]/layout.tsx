import { CreditProvider } from "@/components/SiteLink";
import { getNavigation } from "@/lib/fluid/company";
import { pageContext } from "@/lib/page";
import { renderTemplate } from "@/templates/registry";

/** Each credit is rendered on first request, then cached. */
export function generateStaticParams() {
  return [];
}

/**
 * The storefront chrome. `[credit]` is the rep username from the URL, or
 * `home`; SiteLinks below this layout keep it on every internal link.
 */
export default async function CreditLayout({ children, params }: LayoutProps<"/[locale]/[credit]">) {
  const context = await pageContext(params);
  const navigation = await getNavigation();

  return (
    <CreditProvider credit={context.credit}>
      {renderTemplate("navbar", null, { ...context, links: navigation.header })}
      <main className="flex-1">{children}</main>
      {renderTemplate("footer", null, { ...context, links: navigation.footer })}
    </CreditProvider>
  );
}
