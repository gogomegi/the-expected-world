/**
 * Submission storage abstraction.
 * - Local dev: reads/writes to src/data/submissions.json (filesystem)
 * - Vercel prod: reads/writes to Vercel Blob storage (private, filesystem is read-only)
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

// ── Vercel Blob (production, private store) ──

let cachedBlobUrl: string | null = null;

async function blobRead(): Promise<Submission[]> {
  const { list, getDownloadUrl } = await import("@vercel/blob");

  // Try cached URL first
  if (cachedBlobUrl) {
    try {
      const url = await getDownloadUrl(cachedBlobUrl);
      const res = await fetch(url);
      if (res.ok) return (await res.json()) as Submission[];
    } catch {
      cachedBlobUrl = null;
    }
  }

  // Fall back to listing
  const { blobs } = await list({ prefix: BLOB_KEY });
  if (blobs.length === 0) return [];

  const blob = blobs.find(b => b.pathname === BLOB_KEY) || blobs[0];
  cachedBlobUrl = blob.url;
  const url = await getDownloadUrl(blob.url);
  const res = await fetch(url);
  if (!res.ok) return [];
  return (await res.json()) as Submission[];
}

async function blobWrite(submissions: Submission[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  const blob = await put(BLOB_KEY, JSON.stringify(submissions, null, 2), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  cachedBlobUrl = blob.url;
}

// ── Public API ──

export async function readSubmissions(): Promise<Submission[]> {
  if (useBlob()) {
    try {
      return await blobRead();
    } catch (err) {
      console.error("Blob read error:", err);
      return [];
    }
  }
  return fsRead();
}

export async function writeSubmissions(submissions: Submission[]): Promise<void> {
  if (useBlob()) {
    await blobWrite(submissions);
    return;
  }
  fsWrite(submissions);
}
