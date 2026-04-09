import fs from "fs";
import path from "path";
import type { Quote } from "@/types/quote";

const quotesDirectory = path.join(process.cwd(), "src/data/quotes");

export function getAllQuotes(): Quote[] {
  const files = fs.readdirSync(quotesDirectory).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(quotesDirectory, file), "utf-8");
      return JSON.parse(raw) as Quote;
    })
    .sort((a, b) => a.yearWritten - b.yearWritten);
}

export function getQuoteBySlug(slug: string): Quote | undefined {
  return getAllQuotes().find((q) => q.slug === slug);
}

export function getQuotesByCategory(category: string): Quote[] {
  return getAllQuotes().filter((q) =>
    q.categories.some((c) => slugify(c) === category)
  );
}

export function getQuotesByDecade(decade: string): Quote[] {
  return getAllQuotes().filter((q) => {
    const d = Math.floor(q.yearWritten / 10) * 10;
    return `${d}s` === decade;
  });
}

export function getQuotesByAuthorSlug(authorSlug: string): Quote[] {
  return getAllQuotes().filter((q) => q.authorSlug === authorSlug);
}

export function getQuotesByVerdict(verdict: string): Quote[] {
  return getAllQuotes().filter(
    (q) => q.didItHoldUp && q.didItHoldUp.verdict === verdict
  );
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  getAllQuotes().forEach((q) => q.categories.forEach((c) => cats.add(c)));
  return Array.from(cats).sort();
}

export function getAllDecades(): string[] {
  const decades = new Set<string>();
  getAllQuotes().forEach((q) => {
    const d = Math.floor(q.yearWritten / 10) * 10;
    decades.add(`${d}s`);
  });
  return Array.from(decades).sort();
}

export function getAllAuthors(): { name: string; slug: string }[] {
  const authors = new Map<string, string>();
  getAllQuotes().forEach((q) => {
    if (!authors.has(q.authorSlug)) {
      authors.set(q.authorSlug, q.author);
    }
  });
  return Array.from(authors.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDailyQuote(): Quote {
  const quotes = getAllQuotes();
  const today = new Date();
  const dayOfYear =
    Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
  return quotes[dayOfYear % quotes.length];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
