import { SiteLink } from "@/components/SiteLink";

import type { TemplateProps } from "../types";

export default function FooterDefault({ shop, links }: TemplateProps["footer"]) {
  return (
    <footer className="mt-24 bg-inverse text-inverse-foreground">
      <div className="page-width grid gap-12 py-16 md:grid-cols-[1fr_auto] md:py-20">
        <div className="max-w-sm space-y-4">
          <p className="text-2xl font-bold tracking-tight">{shop.name}</p>
          <p className="text-[15px] leading-relaxed text-white/60">
            Shop our latest products, collections and stories.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-16 gap-y-4 text-[15px] sm:grid-cols-3">
            {links.map((link) => (
              <li key={`${link.title}-${link.href}`}>
                <SiteLink href={link.href} className="text-white/70 transition-colors hover:text-white">
                  {link.title}
                </SiteLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="page-width flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {shop.name}. All rights reserved.
          </p>
          <p>Powered by Fluid</p>
        </div>
      </div>
    </footer>
  );
}
