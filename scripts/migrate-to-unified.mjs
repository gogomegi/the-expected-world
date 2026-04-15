#!/usr/bin/env node
/**
 * Migration script: merges corpus.json entries and quotes/*.json files
 * into a single unified corpus.json with the new Entry schema.
 *
 * Run: node scripts/migrate-to-unified.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const corpusPath = path.join(ROOT, "src/data/corpus.json");
const quotesDir = path.join(ROOT, "src/data/quotes");
const outputPath = path.join(ROOT, "src/data/corpus.json");
const backupPath = path.join(ROOT, "src/data/corpus.backup.json");

// ── Helpers ──

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseYearWritten(dateWritten) {
  if (typeof dateWritten === "number") return dateWritten;
  const match = String(dateWritten).match(/(\d{4})/);
  return match ? parseInt(match[1]) : 0;
}

function mapStatus(oldStatus) {
  const map = {
    confirmed: "published",
    pending: "pending-review",
    rejected: "draft",
    published: "published",
    draft: "draft",
    "pending-review": "pending-review",
  };
  return map[oldStatus] || "pending-review";
}

function mapSourceType(sourceType) {
  const map = {
    ai: "ai-generated",
    human: "original",
    "ai-generated": "ai-generated",
    original: "original",
    "user-submission": "user-submission",
  };
  return map[sourceType] || undefined;
}

function normalizeCategories(entry) {
  if (Array.isArray(entry.categories)) return entry.categories;
  if (entry.category) return [entry.category];
  return [];
}

function deriveYearImagined(entry) {
  // If it already has yearImagined, use it
  if (entry.yearImagined) return String(entry.yearImagined);
  // Derive from predictedDate
  if (entry.predictedDate) {
    const yearMatch = entry.predictedDate.match(/(\d{4})/);
    if (yearMatch) return yearMatch[1];
    return entry.predictedDate;
  }
  if (entry.predictedDateNormalized) {
    return entry.predictedDateNormalized.slice(0, 4);
  }
  return "unknown";
}

function derivePredictedDateNormalized(entry) {
  if (entry.predictedDateNormalized) return entry.predictedDateNormalized;
  if (entry.yearImagined) {
    const match = String(entry.yearImagined).match(/(\d{4})/);
    if (match) return `${match[1]}-01-01`;
  }
  return "2100-01-01"; // far future fallback
}

// ── Convert old corpus Entry → unified ──

function convertCorpusEntry(old) {
  return {
    slug: old.id || slugify(`${old.author}-${old.quote?.slice(0, 30)}`),
    text: old.quote,
    author: old.author,
    authorSlug: slugify(old.author),
    source: old.source,
    sourceUrl: old.source_url || undefined,
    yearWritten: parseYearWritten(old.dateWritten),
    yearImagined: deriveYearImagined(old),
    predictedDateNormalized: derivePredictedDateNormalized(old),
    categories: normalizeCategories(old),
    annotation: old.annotation || undefined,
    tags: old.tags?.length ? old.tags : undefined,
    didItHoldUp: old.actualOutcome
      ? { verdict: "pending", analysis: old.actualOutcome }
      : undefined,
    status: mapStatus(old.status),
    quoteSource: mapSourceType(old.source_type),
    verificationStatus: old.verification_status || undefined,
    verificationNote: old.verification_note || undefined,
    isFiction: old.is_fiction === true ? true : undefined,
  };
}

// ── Convert Quote file → unified ──

function convertQuote(q) {
  return {
    slug: q.slug,
    text: q.text,
    author: q.author,
    authorSlug: q.authorSlug || slugify(q.author),
    source: q.source,
    sourceUrl: q.sourceUrl || undefined,
    yearWritten: q.yearWritten,
    yearImagined: deriveYearImagined(q),
    predictedDateNormalized: derivePredictedDateNormalized(q),
    categories: q.categories || [],
    annotation: undefined,
    tags: undefined,
    imageUrl: q.imageUrl || undefined,
    imageCaption: q.imageCaption || undefined,
    didItHoldUp: q.didItHoldUp || undefined,
    status: mapStatus(q.status || "published"),
    quoteSource: mapSourceType(q.quoteSource),
  };
}

// ── Merge & deduplicate ──

function stripUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mergeEntries(corpusEntry, quoteEntry) {
  // Quote data is generally more curated, prefer it for shared fields
  // but keep corpus-only fields like annotation, tags, verification
  return stripUndefined({
    slug: quoteEntry.slug || corpusEntry.slug,
    text: quoteEntry.text || corpusEntry.text,
    author: quoteEntry.author || corpusEntry.author,
    authorSlug: quoteEntry.authorSlug || corpusEntry.authorSlug,
    source: quoteEntry.source || corpusEntry.source,
    sourceUrl: quoteEntry.sourceUrl || corpusEntry.sourceUrl,
    yearWritten: quoteEntry.yearWritten || corpusEntry.yearWritten,
    yearImagined: quoteEntry.yearImagined || corpusEntry.yearImagined,
    predictedDateNormalized:
      corpusEntry.predictedDateNormalized || quoteEntry.predictedDateNormalized,
    categories: quoteEntry.categories?.length
      ? quoteEntry.categories
      : corpusEntry.categories,
    annotation: corpusEntry.annotation,
    tags: corpusEntry.tags,
    imageUrl: quoteEntry.imageUrl,
    imageCaption: quoteEntry.imageCaption,
    didItHoldUp: quoteEntry.didItHoldUp || corpusEntry.didItHoldUp,
    status:
      quoteEntry.status === "published" ? "published" : corpusEntry.status,
    quoteSource: quoteEntry.quoteSource || corpusEntry.quoteSource,
    verificationStatus: corpusEntry.verificationStatus,
    verificationNote: corpusEntry.verificationNote,
    isFiction: corpusEntry.isFiction,
  });
}

// ── Main ──

console.log("Starting migration...\n");

// Backup original
fs.copyFileSync(corpusPath, backupPath);
console.log(`Backed up corpus.json → corpus.backup.json`);

// Load corpus entries
const corpusRaw = JSON.parse(fs.readFileSync(corpusPath, "utf-8"));
console.log(`Loaded ${corpusRaw.length} corpus entries`);

// Load quote files
const quoteFiles = fs.readdirSync(quotesDir).filter((f) => f.endsWith(".json"));
const quotes = quoteFiles.map((f) =>
  JSON.parse(fs.readFileSync(path.join(quotesDir, f), "utf-8"))
);
console.log(`Loaded ${quotes.length} quote files`);

// Convert corpus entries
const corpusConverted = new Map();
for (const entry of corpusRaw) {
  const converted = convertCorpusEntry(entry);
  corpusConverted.set(converted.slug, converted);
}

// Convert and merge quotes
const quotesConverted = new Map();
for (const q of quotes) {
  const converted = convertQuote(q);
  quotesConverted.set(converted.slug, converted);
}

// Build unified set: start with corpus, merge/add quotes
const unified = new Map(corpusConverted);
let merged = 0,
  added = 0;

for (const [slug, quoteEntry] of quotesConverted) {
  if (unified.has(slug)) {
    // Merge: combine data from both
    unified.set(slug, mergeEntries(unified.get(slug), quoteEntry));
    merged++;
  } else {
    // Check for fuzzy match by author + similar text
    let found = false;
    for (const [cSlug, cEntry] of unified) {
      if (
        cEntry.author === quoteEntry.author &&
        (cEntry.text.slice(0, 60) === quoteEntry.text.slice(0, 60) ||
          quoteEntry.text.includes(cEntry.text.slice(0, 40)))
      ) {
        // Duplicate with different slug — merge under quote's slug
        unified.delete(cSlug);
        unified.set(slug, mergeEntries(cEntry, quoteEntry));
        merged++;
        found = true;
        break;
      }
    }
    if (!found) {
      unified.set(slug, stripUndefined(quoteEntry));
      added++;
    }
  }
}

// Sort by predictedDateNormalized
const result = Array.from(unified.values()).sort((a, b) =>
  a.predictedDateNormalized.localeCompare(b.predictedDateNormalized)
);

// Write output
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");

console.log(`\nMigration complete:`);
console.log(`  Corpus entries: ${corpusRaw.length}`);
console.log(`  Quote files:    ${quotes.length}`);
console.log(`  Merged (dedup): ${merged}`);
console.log(`  New from quotes: ${added}`);
console.log(`  Total unified:  ${result.length}`);
console.log(`\nWritten to ${outputPath}`);
