// app/robots.ts

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lifeflow.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 🟢 গুগল যেন ভুলেও অ্যাডমিন বা ড্যাশবোর্ড ইনডেক্স না করে
      disallow: ["/dashboard/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
