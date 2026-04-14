import type { MetadataRoute } from "next";
import { getConfirmedEntries, getAllCategories, categoryToSlug } from "@/lib/corpus";

const BASE_URL = "https://theexpectedworld.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getConfirmedEntries();
  const categories = getAllCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/timeline`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/closing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/submit`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const entryPages: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${BASE_URL}/entry/${e.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...entryPages, ...categoryPages];
}
