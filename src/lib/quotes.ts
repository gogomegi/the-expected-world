import fs from "fs";
import path from "path";
import type { Quote, Submission } from "@/types/quote";

const quotesDirectory = path.join(process.cwd(), "src/data/quotes");
const submissionsFile = path.join(process.cwd(), "src/data/submissions.json");

// ── Read operations ──

export function getAllQuotesRaw(): Quote[] {
  const files = fs.readdirSync(quotesDirectory).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(quotesDirectory, file), "utf-8");
      const quote = JSON.parse(raw) as Quote;
      // Default status/source for existing quotes
      if (!quote.status) quote.status = "published";
      if (!quote.quoteSource) quote.quoteSource = "ai-generated";
      return quote;
    })
    .sort((a, b) => a.yearWritten - b.yearWritten);
}

export function getAllQuotes(): Quote[] {
  // Public-facing: only published quotes
  return getAllQuotesRaw().filter((q) => q.status === "published" || !q.status);
}

export function getQuoteBySlug(slug: string): Quote | undefined {
  return getAllQuotes().find((q) => q.slug === slug);
}

export function getQuoteBySlugRaw(slug: string): Quote | undefined {
  return getAllQuotesRaw().find((q) => q.slug === slug);
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

// ── Write operations ──

export function saveQuote(quote: Quote): void {
  const filePath = path.join(quotesDirectory, `${quote.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(quote, null, 2), "utf-8");
}

export function deleteQuote(slug: string): boolean {
  const filePath = path.join(quotesDirectory, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

// ── Submissions ──

function readSubmissions(): Submission[] {
  if (!fs.existsSync(submissionsFile)) return [];
  const raw = fs.readFileSync(submissionsFile, "utf-8");
  return JSON.parse(raw) as Submission[];
}

function writeSubmissions(submissions: Submission[]): void {
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2), "utf-8");
}

export function getAllSubmissions(): Submission[] {
  return readSubmissions().sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function addSubmission(sub: Omit<Submission, "id" | "submittedAt" | "status">): Submission {
  const submissions = readSubmissions();
  const newSub: Submission = {
    ...sub,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  submissions.push(newSub);
  writeSubmissions(submissions);
  return newSub;
}

export function updateSubmissionStatus(id: string, status: Submission["status"]): boolean {
  const submissions = readSubmissions();
  const sub = submissions.find((s) => s.id === id);
  if (!sub) return false;
  sub.status = status;
  writeSubmissions(submissions);
  return true;
}

export function getSubmissionById(id: string): Submission | undefined {
  return readSubmissions().find((s) => s.id === id);
}

// ── Utility ──

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
