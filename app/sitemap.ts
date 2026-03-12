// app/sitemap.ts

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // আপনার ডোমেইন কেনা হয়ে গেলে এখানে আসল URL বসিয়ে দেবেন
  const baseUrl = "https://lifeflow.com";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0, // হোমপেজের প্রায়োরিটি সবচেয়ে বেশি
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
