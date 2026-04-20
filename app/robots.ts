import type { MetadataRoute } from "next";
import { getPublicBaseUrl } from "@/lib/payments/config";

export default function robots(): MetadataRoute.Robots {
  const base = getPublicBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", "/payments/return"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
