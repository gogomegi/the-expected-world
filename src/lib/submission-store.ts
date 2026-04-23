/**
 * Submission storage abstraction.
 * - Local dev: reads/writes to src/data/submissions.json (filesystem)
 * - Vercel prod: reads/writes to Vercel Blob storage (filesystem is read-only)
 */
import fs from "fs";
import path from "path";
import type { Submission } from "@/types/quote";

const SUBMISSIONS_FILE = path.join(process.cwd(), "src/data/submissions.json");
const BLOB_KEY = "submissions.json";

function useBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// ── Filesystem (local dev) ──

function fsRead(): Submission[] {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
  const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
  return JSON.parse(raw) as Submission[];
}

function fsWrite(submissions: Submission[]): void {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
}

// ── Vercel Blob (production) ──

async function blobRead(): Promise<Submission[]> {
  // Dynamic import to avoid bundling @vercel/blob in dev
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_KEY, limit: 1 });
  if (blobs.length === 0) return [];
  const res = await fetch(blobs[0].url);
  if (!res.ok) return [];
  return (await res.json()) as Submission[];
}

async function blobWrite(submissions: Submission[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(submissions, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

// ── Public API ──

export async function readSubmissions(): Promise<Submission[]> {
  if (useBlob()) return blobRead();
  return fsRead();
}

export async function writeSubmissions(submissions: Submission[]): Promise<void> {
  if (useBlob()) return blobWrite(submissions);
  fsWrite(submissions);
}
