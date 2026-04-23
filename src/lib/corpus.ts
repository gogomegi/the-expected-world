import corpusData from '@/data/corpus.json';

export interface Entry {
  id: string;
  quote: string;
  author: string;
  source: string;
  dateWritten: string;
  predictedDate: string;
  predictedDateNormalized: string;
  category: string;
  annotation: string;
  actualOutcome?: string;
  tags: string[];
  source_type?: 'ai' | 'human';
  status?: 'pending' | 'confirmed' | 'rejected';
  verification_status?: 'verified' | 'paraphrased' | 'unverified' | 'fabricated';
  source_url?: string;
  verification_note?: string;
  is_fiction?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

const allEntries: Entry[] = corpusData as Entry[];

/** Only confirmed entries appear on the public site */
const confirmedEntries: Entry[] = allEntries.filter(e => e.status === 'confirmed');

const TODAY = new Date().toISOString().slice(0, 10);

/** Past-dated confirmed entries (the archive — gate closed) */
export function getArchiveEntries(): Entry[] {
  return confirmedEntries.filter(e => e.predictedDateNormalized <= TODAY);
}

/** Future-dated confirmed entries (gate still closing) */
export function getClosingEntries(): Entry[] {
  return confirmedEntries
    .filter(e => e.predictedDateNormalized > TODAY)
    .sort((a, b) => a.predictedDateNormalized.localeCompare(b.predictedDateNormalized));
}

/** Is a predicted date in the past? */
export function isExpired(predictedDateNormalized: string): boolean {
  return predictedDateNormalized <= TODAY;
}

/** Display year for EXPIRES/CLOSING labels — uses predictedDate for approximate entries */
export function displayYear(entry: Entry): string {
  const pd = entry.predictedDate.toLowerCase();
  // If the predicted date is approximate/vague, show a friendly label
  if (pd.includes('distant future') || pd.includes('approx')) {
    // Extract century or description
    const centuryMatch = entry.predictedDate.match(/(\d+)(?:st|nd|rd|th)\s+century/i);
    if (centuryMatch) {
      const n = parseInt(centuryMatch[1]);
      const suffix = n === 21 ? 'st' : n === 22 ? 'nd' : n === 23 ? 'rd' : 'th';
      return `~${n}${suffix} century`;
    }
    return entry.predictedDateNormalized.slice(0, 4);
  }
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
  };
  return map[category] || category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** All entries (for admin, static params, etc.) */
export function getAllEntries(): Entry[] { return allEntries; }

/** Confirmed entries only (public site) */
export function getConfirmedEntries(): Entry[] { return confirmedEntries; }

export function getEntryById(id: string): Entry | undefined { return allEntries.find(e => e.id === id); }
export function getAllCategories(): Category[] { return categories; }
export function getCategoryBySlug(slug: string): Category | undefined { return categories.find(c => c.slug === slug); }

export function getEntriesByCategory(slug: string): Entry[] {
  return confirmedEntries.filter(e => categoryToSlug(e.category) === slug);
}

export function getFeaturedEntry(): Entry {
  const cardin = confirmedEntries.find(e => e.id === 'joseph-barry-1968-lovable');
  if (cardin) return cardin;
  const archive = getArchiveEntries();
  if (archive.length === 0) return confirmedEntries[0];
  return archive[0];
}

export function getRecentEntries(n = 10): Entry[] {
  return [...getArchiveEntries()].sort((a, b) => b.predictedDateNormalized.localeCompare(a.predictedDateNormalized)).slice(0, n);
}

export function getRelatedEntries(entry: Entry, n = 3): Entry[] {
  const slug = categoryToSlug(entry.category);
  return confirmedEntries.filter(e => e.id !== entry.id && categoryToSlug(e.category) === slug).slice(0, n);
}

export function getEntriesByDecade(): Record<string, Entry[]> {
  const decades: Record<string, Entry[]> = {};
  for (const e of confirmedEntries) {
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
