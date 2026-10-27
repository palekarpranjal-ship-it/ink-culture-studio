import type { MetadataRoute } from "next";

const siteUrl = "https://www.streetculturetattoos.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicitly welcome AI answer engines / crawlers (Generative Engine
      // Optimization): they get the same public site as everyone else.
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: "/",
        disallow: ["/redeem", "/api/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/redeem", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
