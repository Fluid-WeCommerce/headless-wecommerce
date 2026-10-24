import { CartLink } from "@/components/cart/CartLink";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { MobileMenu } from "@/components/MobileMenu";
import { SiteLink } from "@/components/SiteLink";
import type { NavLink } from "@/config/site";

import type { TemplateProps } from "../types";

/** Logo, navigation, country and language, search and cart, after the base theme's navbar. */
export default function NavbarDefault({ shop, locale, links }: TemplateProps["navbar"]) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="page-width flex h-16 items-center gap-8 lg:h-[4.5rem]">
        <SiteLink href="/" className="flex shrink-0 items-center text-xl font-bold tracking-tight">
          {shop.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo dimensions vary per brand.
            <img src={shop.logoUrl} alt={shop.name} className="h-8 w-auto max-w-40 object-contain lg:h-9" />
          ) : (
            shop.name
          )}
        </SiteLink>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={`${link.title}-${link.href}`} className="group relative">
                <NavItem link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LocaleSwitcher
            locale={locale}
            languages={shop.languages}
            countries={shop.countries}
            className="hidden sm:block"
          />
          <SiteLink
            href="/search"
            aria-label="Search"
            className="inline-flex size-10 items-center justify-center rounded-sm hover:bg-surface"
          >
            <SearchIcon width={22} height={22} />
          </SiteLink>
          <CartLink />
          <MobileMenu links={links} locale={locale} languages={shop.languages} countries={shop.countries} />
        </div>
      </div>
    </header>
  );
}

const itemClass = "flex h-10 items-center gap-1 rounded-sm px-3 text-[15px] font-medium hover:bg-surface";

function NavItem({ link }: { link: NavLink }) {
  if (!link.children?.length) {
    return (
      <SiteLink href={link.href} className={itemClass}>
        {link.title}
      </SiteLink>
    );
  }

  return (
    <>
      <SiteLink href={link.href} className={itemClass}>
        {link.title}
        <ChevronDownIcon width={16} height={16} className="transition-transform group-hover:rotate-180" />
      </SiteLink>
      <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="min-w-56 rounded-sm border border-border bg-background p-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]">
          {link.children.map((child) => (
            <li key={`${child.title}-${child.href}`}>
              <SiteLink href={child.href} className="block rounded-sm px-3 py-2.5 text-[15px] hover:bg-surface">
                {child.title}
              </SiteLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
