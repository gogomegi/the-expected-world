/**
 * Newsletter subscriber storage abstraction.
 * - Local dev: reads/writes to src/data/newsletter-subscribers.json (filesystem)
 * - Vercel prod: reads/writes to Vercel Blob storage (private)
 */
import fs from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "src/data/newsletter-subscribers.json");
const BLOB_KEY = "newsletter-subscribers.json";

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

function useBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// ── Filesystem (local dev) ──

function fsRead(): Subscriber[] {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
  const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
  return JSON.parse(raw) as Subscriber[];
}

function fsWrite(subscribers: Subscriber[]): void {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
}

// ── Vercel Blob (production, private store) ──

async function blobRead(): Promise<Subscriber[]> {
  const blob = await import("@vercel/blob");

  try {
    const result = await blob.get(BLOB_KEY, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || result.statusCode === 304) return [];

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
    return JSON.parse(text) as Subscriber[];
  } catch (err: unknown) {
    if (err && typeof err === "object" && "name" in err &&
        (err as { name: string }).name === "BlobNotFoundError") {
      return [];
    }
    throw err;
  }
}

async function blobWrite(subscribers: Subscriber[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(subscribers, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

// ── Public API ──

export async function readSubscribers(): Promise<Subscriber[]> {
  if (useBlob()) return blobRead();
  return fsRead();
}

export async function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  if (useBlob()) {
    await blobWrite(subscribers);
    return;
  }
  fsWrite(subscribers);
}
