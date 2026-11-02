import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/wp-admin",
        "/wp-admin/admin-ajax.php",
        "/wp-content/plugins",
      ],
    },
    sitemap: "https://www.shanviatech.com/sitemap.xml",
  };
}