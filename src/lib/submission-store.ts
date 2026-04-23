/**
 * Submission storage abstraction.
 * - Local dev: reads/writes to src/data/submissions.json (filesystem)
 * - Vercel prod: reads/writes to Vercel Blob storage (private)
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

async function blobRead(): Promise<Submission[]> {
  const blob = await import("@vercel/blob");

  try {
    const result = await blob.get(BLOB_KEY, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || result.statusCode === 304) return [];

    // Read from the stream returned by get()
    const reader = result.stream?.getReader();
    if (!reader) return [];
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const text = new TextDecoder().decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array(0))
    );
    return JSON.parse(text) as Submission[];
  } catch (err: unknown) {
    // BlobNotFoundError means no submissions yet
    if (err && typeof err === "object" && "name" in err &&
        (err as { name: string }).name === "BlobNotFoundError") {
      return [];
    }
    throw err;
  }
}

async function blobWrite(submissions: Submission[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(submissions, null, 2), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

// ── Public API ──

export async function readSubmissions(): Promise<Submission[]> {
  if (useBlob()) return blobRead();
  return fsRead();
}

export async function writeSubmissions(submissions: Submission[]): Promise<void> {
  if (useBlob()) {
    await blobWrite(submissions);
    return;
  }
  fsWrite(submissions);
}
