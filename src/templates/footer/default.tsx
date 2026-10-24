import { SiteLink } from "@/components/SiteLink";

import { LocaleSwitcher } from "@/components/LocaleSwitcher";

import type { TemplateProps } from "../types";

export default function FooterDefault({ shop, locale, links }: TemplateProps["footer"]) {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="page-width flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <p className="font-semibold">{shop.name}</p>
          <LocaleSwitcher locale={locale} languages={shop.languages} countries={shop.countries} />
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
            {links.map((link) => (
              <li key={`${link.title}-${link.href}`}>
                <SiteLink href={link.href} className="text-muted hover:text-foreground">
                  {link.title}
                </SiteLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="page-width border-t border-border py-6 text-xs text-muted">
        © {new Date().getFullYear()} {shop.name}
      </div>
    </footer>
  );
}
