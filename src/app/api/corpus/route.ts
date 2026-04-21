import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CORPUS_PATH = join(process.cwd(), "src/data/corpus.json");
const QUOTES_DIR = join(process.cwd(), "src/data/quotes");

interface CorpusEntry {
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
  source_type?: string;
  status: string;
  source_url?: string;
  is_fiction?: boolean;
}

function readCorpus(): CorpusEntry[] {
  const raw = readFileSync(CORPUS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeCorpus(data: CorpusEntry[]) {
  writeFileSync(CORPUS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/** Map corpus status to individual quote file status */
function toQuoteStatus(corpusStatus: string): string {
  if (corpusStatus === "confirmed") return "published";
  return "pending";
}

/** Slug-ify a string for file naming */
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Map corpus category to quote categories array */
function toQuoteCategories(category: string): string[] {
  const map: Record<string, string[]> = {
    "Technology": ["Technology"],
    "Governance & Power": ["War & Politics"],
    "Environment & Resources": ["Environment"],
    "Daily Life": ["Society"],
    "Space & Exploration": ["Science"],
    "Medicine & the Body": ["Health & Medicine"],
    "War & Conflict": ["War & Politics"],
    "Culture & Society": ["Society", "Culture & Entertainment"],
  };
  return map[category] || [category];
}

/** Sync a corpus entry to its individual quote JSON file */
function syncQuoteFile(entry: CorpusEntry) {
  const filePath = join(QUOTES_DIR, `${entry.id}.json`);
  const quoteStatus = toQuoteStatus(entry.status);

  if (existsSync(filePath)) {
    // Update existing file's status only
    const raw = readFileSync(filePath, "utf-8");
    const quote = JSON.parse(raw);
    quote.status = quoteStatus;
    writeFileSync(filePath, JSON.stringify(quote, null, 2), "utf-8");
  } else if (entry.status === "confirmed") {
    // Create new quote file from corpus data when confirming
    const yearMatch = entry.dateWritten.match(/\d{4}/);
    const yearWritten = yearMatch ? parseInt(yearMatch[0]) : 2000;

    const quote = {
      slug: entry.id,
      text: entry.quote,
      author: entry.author,
      authorSlug: slugify(entry.author),
      source: entry.source,
      sourceUrl: entry.source_url || "",
      yearWritten,
      yearImagined: entry.predictedDate,
      categories: toQuoteCategories(entry.category),
      didItHoldUp: {
        verdict: "pending" as const,
        analysis: entry.annotation || "",
      },
      quoteSource: entry.source_type === "human" ? "original" : "ai-generated",
      status: "published",
    };
    writeFileSync(filePath, JSON.stringify(quote, null, 2), "utf-8");
  }
}

export async function GET() {
  return Response.json(readCorpus());
}

export async function PUT(request: Request) {
  const updated = await request.json();
  const corpus = readCorpus();
  const idx = corpus.findIndex((e) => e.id === updated.id);
  if (idx === -1) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }
  corpus[idx] = { ...corpus[idx], ...updated };
  writeCorpus(corpus);
  syncQuoteFile(corpus[idx]);
  return Response.json(corpus[idx]);
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  const corpus = readCorpus();
  const idx = corpus.findIndex((e) => e.id === id);
  if (idx === -1) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }
  corpus[idx].status = status;
  writeCorpus(corpus);
  syncQuoteFile(corpus[idx]);
  return Response.json(corpus[idx]);
}
