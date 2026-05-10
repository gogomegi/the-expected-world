import type { MetadataRoute } from "next";
import { getConfirmedEntries, getAllCategories, categoryToSlug } from "@/lib/corpus";
import { statSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = "https://theexpectedworld.com";

/** Get the last-modified time of corpus.json as an ISO 8601 string */
function getCorpusLastModified(): string {
  try {
    const stat = statSync(join(process.cwd(), "src/data/corpus.json"));
    return stat.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getConfirmedEntries();
  const categories = getAllCategories();
  const corpusModified = getCorpusLastModified();
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/timeline`, lastModified: corpusModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/closing`, lastModified: corpusModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/submit`, lastModified: "2025-01-01", changeFrequency: "monthly", priority: 0.4 },
  ];

  const entryPages: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${BASE_URL}/entry/${e.id}`,
    lastModified: corpusModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: corpusModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...entryPages, ...categoryPages];
}
