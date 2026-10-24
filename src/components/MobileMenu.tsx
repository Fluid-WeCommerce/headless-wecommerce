"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { NavLink } from "@/config/site";
import type { Locale } from "@/lib/fluid/locale";

import { CloseIcon, MenuIcon } from "./icons";
import { LocaleForm } from "./LocaleSwitcher";
import { SiteLink } from "./SiteLink";

/** The header's menu on small screens: navigation plus the country and language picker. */
export function MobileMenu({
  links,
  locale,
  languages,
  countries,
}: {
  links: NavLink[];
  locale: Locale;
  languages: string[];
  countries: string[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation.
  const [openedAt, setOpenedAt] = useState(pathname);
  if (open && pathname !== openedAt) {
    setOpen(false);
    setOpenedAt(pathname);
  }

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => {
          setOpenedAt(pathname);
          setOpen((value) => !value);
        }}
        className="inline-flex size-10 items-center justify-center rounded-sm hover:bg-surface"
      >
        {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
      </button>
      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-background">
          <nav aria-label="Main" className="page-width py-6">
            <ul className="divide-y divide-border border-b border-border">
              {links.map((link) => (
                <li key={`${link.title}-${link.href}`} className="py-4">
                  <SiteLink href={link.href} className="block text-xl font-medium">
                    {link.title}
                  </SiteLink>
                  {link.children?.length ? (
                    <ul className="mt-3 space-y-3 pl-4">
                      {link.children.map((child) => (
                        <li key={`${child.title}-${child.href}`}>
                          <SiteLink href={child.href} className="text-muted">
                            {child.title}
                          </SiteLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            {languages.length > 1 || countries.length > 1 ? (
              <div className="mt-8">
                <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">Country &amp; language</p>
                <LocaleForm locale={locale} languages={languages} countries={countries} />
              </div>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
