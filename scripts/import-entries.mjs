#!/usr/bin/env node
/**
 * Import entries from content agent's database into corpus.json
 *
 * Usage: node scripts/import-entries.mjs [path-to-entries.json]
 * Default: /vibespace/.agents/content/output/entries-database.json
 *
 * Entries are imported with status "pending" for admin review.
 * Run this script, then review entries in the admin panel at /admin.
 */

import fs from "fs";
import path from "path";

const INPUT_PATH = process.argv[2] || "/vibespace/.agents/content/output/entries-database.json";
const CORPUS_PATH = path.join(process.cwd(), "src/data/corpus.json");

// Category mapping from content agent format to corpus format
const CATEGORY_MAP = {
  "Daily Life": "Daily Life",
  "Technology": "Technology",
  "Culture": "Culture & Society",
  "Culture & Society": "Culture & Society",
  "Culture & Entertainment": "Culture & Society",
  "Politics": "Governance & Power",
  "Governance": "Governance & Power",
  "Governance & Power": "Governance & Power",
  "Economics": "Daily Life",
  "Economy": "Daily Life",
  "Science": "Technology",
  "Environment": "Environment & Resources",
  "Environment & Resources": "Environment & Resources",
  "Space": "Space",
  "Space & Exploration": "Space",
  "Medicine": "Medicine & the Body",
  "Medicine & the Body": "Medicine & the Body",
  "Health & Medicine": "Medicine & the Body",
  "War & Conflict": "War & Conflict",
  "War & Politics": "War & Conflict",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeDate(yearPredicted) {
  const y = typeof yearPredicted === "string" ? parseInt(yearPredicted) : yearPredicted;
  if (isNaN(y)) return "2100-01-01"; // far future for unknown
  return `${y}-01-01`;
}

function transformEntry(entry) {
  const id = entry.id || slugify(`${entry.author}-${(entry.prediction_text || "").slice(0, 40)}-${entry.year_written}`);
  const category = CATEGORY_MAP[entry.category] || entry.category || "Culture & Society";

  return {
    id,
    quote: entry.prediction_text || entry.quote || "",
    author: entry.author || "Unknown",
    source: entry.source || "",
    dateWritten: String(entry.year_written || ""),
    predictedDate: String(entry.year_predicted || "Unknown"),
    predictedDateNormalized: normalizeDate(entry.year_predicted),
    category,
    annotation: entry.what_happened || entry.annotation || "",
    actualOutcome: entry.what_happened || entry.actualOutcome || "",
    tags: entry.tags || [],
    source_type: "human",
    status: "pending",
    verification_status: "unverified",
    source_url: entry.source_url || "",
    is_fiction: false,
  };
}

// Main
const rawEntries = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf-8"));

const existingIds = new Set(corpus.map((e) => e.id));
let imported = 0;
let skipped = 0;

for (const entry of rawEntries) {
  const transformed = transformEntry(entry);
  if (existingIds.has(transformed.id)) {
    console.log(`  SKIP (duplicate): ${transformed.id}`);
    skipped++;
    continue;
  }
  corpus.push(transformed);
  existingIds.add(transformed.id);
  imported++;
  console.log(`  ADD: ${transformed.id} — ${transformed.author}, ${transformed.dateWritten}`);
}

fs.writeFileSync(CORPUS_PATH, JSON.stringify(corpus, null, 2), "utf-8");

console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}, Total corpus: ${corpus.length}`);
console.log(`\nAll new entries imported with status "pending".`);
console.log(`Review them in the admin panel at /admin → Corpus tab.`);
