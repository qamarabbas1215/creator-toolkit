import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { tools } from "@/data/tools";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/pro`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: tool.addedAt,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}