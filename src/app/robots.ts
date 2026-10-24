import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/fluid/config";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  // Only the production deployment should be indexed, not Vercel previews.
  const indexable = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;

  return {
    rules: indexable
      ? { userAgent: "*", allow: "/", disallow: ["/cart", "/search", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: indexable ? `${base}/sitemap.xml` : undefined,
  };
}
