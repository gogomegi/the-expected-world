import type { MetadataRoute } from "next";
import { getAllQuotes, getAllCategories, getAllDecades, getAllAuthors, slugify } from "@/lib/quotes";

const BASE_URL = "https://theexpectedworld.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const quotes = getAllQuotes();
  const categories = getAllCategories();
  const decades = getAllDecades();
  const authors = getAllAuthors();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/predictions`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/verdicts`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/submit`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const predictionPages: MetadataRoute.Sitemap = quotes.map((q) => ({
    url: `${BASE_URL}/predictions/${q.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const topicPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/topic/${slugify(cat)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const decadePages: MetadataRoute.Sitemap = decades.map((d) => ({
    url: `${BASE_URL}/decade/${d}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const authorPages: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${BASE_URL}/author/${a.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...predictionPages,
    ...topicPages,
    ...decadePages,
    ...authorPages,
  ];
}
