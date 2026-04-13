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
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

const entries: Entry[] = corpusData as Entry[];

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

export function getAllEntries(): Entry[] { return entries; }
export function getEntryById(id: string): Entry | undefined { return entries.find(e => e.id === id); }
export function getAllCategories(): Category[] { return categories; }
export function getCategoryBySlug(slug: string): Category | undefined { return categories.find(c => c.slug === slug); }

export function getEntriesByCategory(slug: string): Entry[] {
  return entries.filter(e => categoryToSlug(e.category) === slug);
}

export function getFeaturedEntry(): Entry {
  const today = new Date();
  const tm = today.getMonth(), td = today.getDate();
  let best = entries[0], bestDiff = Infinity;
  for (const e of entries) {
    const d = new Date(e.predictedDateNormalized);
    let diff = Math.abs((d.getMonth() * 31 + d.getDate()) - (tm * 31 + td));
    if (diff > 183) diff = 366 - diff;
    if (diff < bestDiff) { bestDiff = diff; best = e; }
  }
  return best;
}

export function getRecentEntries(n = 10): Entry[] {
  return [...entries].sort((a, b) => b.predictedDateNormalized.localeCompare(a.predictedDateNormalized)).slice(0, n);
}

export function getRelatedEntries(entry: Entry, n = 3): Entry[] {
  const slug = categoryToSlug(entry.category);
  return entries.filter(e => e.id !== entry.id && categoryToSlug(e.category) === slug).slice(0, n);
}

export function getEntriesByDecade(): Record<string, Entry[]> {
  const decades: Record<string, Entry[]> = {};
  for (const e of entries) {
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
