import { SiteLink } from "@/components/SiteLink";

import { CartLink } from "@/components/cart/CartLink";
import type { NavLink } from "@/config/site";

import type { TemplateProps } from "../types";

export default function NavbarDefault({ shop, links }: TemplateProps["navbar"]) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="page-width flex h-16 items-center gap-6">
        <SiteLink href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          {shop.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo dimensions vary per brand.
            <img src={shop.logoUrl} alt={shop.name} className="h-8 w-auto" />
          ) : (
            shop.name
          )}
        </SiteLink>

        <nav aria-label="Main" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-6 text-sm">
            {links.map((link) => (
              <li key={`${link.title}-${link.href}`} className="group relative">
                <NavItem link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <SiteLink href="/search" className="text-sm">
            Search
          </SiteLink>
          <CartLink />
        </div>
      </div>

      <details className="border-t border-border md:hidden">
        <summary className="page-width cursor-pointer py-3 text-sm font-medium">Menu</summary>
        <ul className="page-width space-y-3 pb-4 text-sm">
          {links.map((link) => (
            <li key={`${link.title}-${link.href}`}>
              <SiteLink href={link.href}>{link.title}</SiteLink>
              {link.children?.length ? (
                <ul className="mt-2 space-y-2 pl-4 text-muted">
                  {link.children.map((child) => (
                    <li key={`${child.title}-${child.href}`}>
                      <SiteLink href={child.href}>{child.title}</SiteLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </details>
    </header>
  );
}

function NavItem({ link }: { link: NavLink }) {
  if (!link.children?.length) {
    return (
      <SiteLink href={link.href} className="hover:text-brand">
        {link.title}
      </SiteLink>
    );
  }

  return (
    <>
      <SiteLink href={link.href} className="hover:text-brand">
        {link.title}
      </SiteLink>
      <ul className="invisible absolute left-0 top-full min-w-48 rounded-xl border border-border bg-background p-3 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {link.children.map((child) => (
          <li key={`${child.title}-${child.href}`}>
            <SiteLink href={child.href} className="block rounded-md px-3 py-2 hover:bg-surface">
              {child.title}
            </SiteLink>
          </li>
        ))}
      </ul>
    </>
  );
}
