/**
 * Storefront settings you are expected to edit.
 *
 * Brand name, logo, colors, languages and countries come from Fluid and do
 * not belong here.
 */

/** How long Fluid responses are cached before they are fetched again. */
export const revalidateSeconds = Number(process.env.FLUID_REVALIDATE_SECONDS ?? 300);

/** Products per page on the shop, category, collection and search pages. */
export const productsPerPage = 24;

/**
 * Slugs of the Fluid menus (Admin → Online Store → Navigation) shown in the
 * header and footer. Reading menus needs FLUID_COMPANY_PRIVATE_TOKEN; without
 * it, or when a menu is missing, the fallback links below are used.
 */
export const menus = {
  header: process.env.FLUID_HEADER_MENU ?? "main-menu",
  footer: process.env.FLUID_FOOTER_MENU ?? "footer",
};

export interface NavLink {
  title: string;
  href: string;
  children?: NavLink[];
}

export const fallbackNavigation: { header: NavLink[]; footer: NavLink[] } = {
  header: [
    { title: "Shop", href: "/shop" },
    { title: "Collections", href: "/collections" },
    { title: "Categories", href: "/categories" },
    { title: "Join", href: "/join" },
    { title: "Blog", href: "/blog" },
  ],
  footer: [
    { title: "Shop", href: "/shop" },
    { title: "Blog", href: "/blog" },
    { title: "Search", href: "/search" },
    { title: "Cart", href: "/cart" },
  ],
};
