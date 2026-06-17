import type { MetadataRoute } from "next";
import { sampleStories } from "@/lib/sample-stories";
import { CATEGORIES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thecampusvoice.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/survey`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/write-for-us`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const storyPages = sampleStories
    .filter((s) => s.status === "PUBLISHED")
    .map((story) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...storyPages];
}
