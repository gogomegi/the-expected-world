import corpusData from '@/data/corpus.json';
import type { Entry, Verdict, EntryStatus, VerificationStatus } from '@/types/quote';

// Re-export the unified type so existing imports still work
export type { Entry, Verdict, EntryStatus, VerificationStatus };

export interface Category {
  slug: string;
  name: string;
  description: string;
}

const allEntries: Entry[] = corpusData as Entry[];

/** Only published entries appear on the public site */
const publishedEntries: Entry[] = allEntries.filter(e => e.status === 'published');

const TODAY = new Date().toISOString().slice(0, 10);

// ── Archive / Timeline queries ──

/** Past-dated published entries (the archive — gate closed) */
export function getArchiveEntries(): Entry[] {
  return publishedEntries.filter(e => e.predictedDateNormalized <= TODAY);
}

/** Future-dated published entries (gate still closing) */
export function getClosingEntries(): Entry[] {
  return publishedEntries
    .filter(e => e.predictedDateNormalized > TODAY)
    .sort((a, b) => a.predictedDateNormalized.localeCompare(b.predictedDateNormalized));
}

/** Is a predicted date in the past? */
export function isExpired(predictedDateNormalized: string): boolean {
  return predictedDateNormalized <= TODAY;
}

/** Display year for EXPIRES/CLOSING labels */
export function displayYear(entry: Entry): string {
  return entry.predictedDateNormalized.slice(0, 4);
}

/** How far away is a future predicted date? */
export function timeRemaining(predictedDateNormalized: string): string {
  const target = new Date(predictedDateNormalized);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'arrived';
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} days remaining`;
  if (days < 365) return `${Math.floor(days / 30)} months remaining`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (months > 0) return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''} remaining`;
  return `${years} year${years !== 1 ? 's' : ''} remaining`;
}

// ── Categories ──

const categories: Category[] = [
  { slug: "technology", name: "Technology", description: "Computing, communications, transportation, energy, manufacturing, automation, artificial intelligence, consumer devices." },
  { slug: "governance", name: "Governance & Power", description: "Political systems, elections, international relations, law, regulation, surveillance, institutional design, diplomacy, empire." },
  { slug: "environment", name: "Environment & Resources", description: "Climate, ecology, agriculture, water, energy supply, pollution, extinction, weather, resource depletion, land use." },
  { slug: "daily-life", name: "Daily Life", description: "Domestic routines, food, clothing, housing, work, leisure, family structure, education, consumer culture, the texture of ordinary existence." },
  { slug: "space", name: "Space & Exploration", description: "Spaceflight, lunar and planetary settlement, telescopy, extraterrestrial contact, satellite infrastructure, the frontier imagination." },
  { slug: "medicine", name: "Medicine & the Body", description: "Disease, public health, pharmaceuticals, surgery, longevity, disability, reproduction, genetic science, epidemics." },
  { slug: "war-conflict", name: "War & Conflict", description: "Military technology, nuclear weapons, arms races, insurgency, civil war, defense planning, strategic doctrine, peace projections." },
  { slug: "culture", name: "Culture & Society", description: "Art, religion, language, demographics, migration, cities, race, class, gender, morality, media, the shape of public life." },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function categoryToSlug(category: string): string {
  const map: Record<string, string> = {
    Technology: "technology",
    Governance: "governance",
    "Governance & Power": "governance",
    Environment: "environment",
    "Environment & Resources": "environment",
    "Daily Life": "daily-life",
    Space: "space",
    "Space & Exploration": "space",
    Medicine: "medicine",
    "Medicine & the Body": "medicine",
    "War & Conflict": "war-conflict",
    Culture: "culture",
    "Culture & Society": "culture",
    // Quote-system categories
    "AI & Robots": "technology",
    "Economy": "daily-life",
    "Society": "culture",
  };
  return map[category] || slugify(category);
}

// ── Core accessors ──

/** All entries (for admin, static params, etc.) */
export function getAllEntries(): Entry[] { return allEntries; }

/** Published entries only (public site) */
export function getConfirmedEntries(): Entry[] { return publishedEntries; }

/** Alias — matches the old quotes.ts API */
export function getAllQuotes(): Entry[] { return publishedEntries; }

export function getEntryById(id: string): Entry | undefined {
  return allEntries.find(e => e.slug === id);
}

export function getEntryBySlug(slug: string): Entry | undefined {
  return allEntries.find(e => e.slug === slug);
}

/** Alias for old quotes.ts consumers */
export function getQuoteBySlug(slug: string): Entry | undefined {
  return getEntryBySlug(slug);
}

export function getAllCategories(): Category[] { return categories; }
export function getCategoryBySlug(slug: string): Category | undefined { return categories.find(c => c.slug === slug); }

// ── Filtered queries ──

export function getEntriesByCategory(slug: string): Entry[] {
  return publishedEntries.filter(e =>
    e.categories.some(c => categoryToSlug(c) === slug)
  );
}

export function getEntriesByDecade(): Record<string, Entry[]> {
  const decades: Record<string, Entry[]> = {};
  for (const e of publishedEntries) {
    const year = parseInt(e.predictedDateNormalized.slice(0, 4));
    const decade = `${Math.floor(year / 10) * 10}s`;
    if (!decades[decade]) decades[decade] = [];
    decades[decade].push(e);
  }
  const out: Record<string, Entry[]> = {};
  for (const k of Object.keys(decades).sort()) {
    out[k] = decades[k].sort((a, b) => a.predictedDateNormalized.localeCompare(b.predictedDateNormalized));
  }
  return out;
}

export function getEntriesByVerdict(verdict: string): Entry[] {
  return publishedEntries.filter(
    e => e.didItHoldUp && e.didItHoldUp.verdict === verdict
  );
}

export function getEntriesByAuthorSlug(authorSlug: string): Entry[] {
  return publishedEntries.filter(e => e.authorSlug === authorSlug);
}

// ── Queries from old quotes.ts ──

export function getAllQuoteCategories(): string[] {
  const cats = new Set<string>();
  publishedEntries.forEach(e => e.categories.forEach(c => cats.add(c)));
  return Array.from(cats).sort();
}

export function getAllDecades(): string[] {
  const decades = new Set<string>();
  publishedEntries.forEach(e => {
    const year = parseInt(e.predictedDateNormalized.slice(0, 4));
    decades.add(`${Math.floor(year / 10) * 10}s`);
  });
  return Array.from(decades).sort();
}

export function getQuotesByDecade(decade: string): Entry[] {
  return publishedEntries.filter(e => {
    const year = parseInt(e.predictedDateNormalized.slice(0, 4));
    return `${Math.floor(year / 10) * 10}s` === decade;
  });
}

export function getQuotesByCategory(category: string): Entry[] {
  return publishedEntries.filter(e =>
    e.categories.some(c => slugify(c) === category)
  );
}

export function getQuotesByAuthorSlug(authorSlug: string): Entry[] {
  return getEntriesByAuthorSlug(authorSlug);
}

export function getQuotesByVerdict(verdict: string): Entry[] {
  return getEntriesByVerdict(verdict);
}

export function getAllAuthors(): { name: string; slug: string }[] {
  const authors = new Map<string, string>();
  publishedEntries.forEach(e => {
    if (!authors.has(e.authorSlug)) {
      authors.set(e.authorSlug, e.author);
    }
  });
  return Array.from(authors.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ── Featured / Recent / Related ──

export function getFeaturedEntry(): Entry {
  const archive = getArchiveEntries();
  if (archive.length === 0) return publishedEntries[0];
  const today = new Date();
  const tm = today.getMonth(), td = today.getDate();
  let best = archive[0], bestDiff = Infinity;
  for (const e of archive) {
    const d = new Date(e.predictedDateNormalized);
    let diff = Math.abs((d.getMonth() * 31 + d.getDate()) - (tm * 31 + td));
    if (diff > 183) diff = 366 - diff;
    if (diff < bestDiff) { bestDiff = diff; best = e; }
  }
  return best;
}

export function getRecentEntries(n = 10): Entry[] {
  return [...getArchiveEntries()]
    .sort((a, b) => b.predictedDateNormalized.localeCompare(a.predictedDateNormalized))
    .slice(0, n);
}

export function getRelatedEntries(entry: Entry, n = 3): Entry[] {
  return publishedEntries
    .filter(e => e.slug !== entry.slug && e.categories.some(c =>
      entry.categories.some(ec => categoryToSlug(ec) === categoryToSlug(c))
    ))
    .slice(0, n);
}

export function getDailyQuote(): Entry {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return publishedEntries[dayOfYear % publishedEntries.length];
}
