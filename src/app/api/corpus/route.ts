import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CORPUS_PATH = join(process.cwd(), "src/data/corpus.json");

function readCorpus() {
  const raw = readFileSync(CORPUS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeCorpus(data: unknown[]) {
  writeFileSync(CORPUS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return Response.json(readCorpus());
}

export async function PUT(request: Request) {
  const updated = await request.json();
  const corpus = readCorpus();
  const idx = corpus.findIndex((e: { id: string }) => e.id === updated.id);
  if (idx === -1) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }
  corpus[idx] = { ...corpus[idx], ...updated };
  writeCorpus(corpus);
  return Response.json(corpus[idx]);
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  const corpus = readCorpus();
  const idx = corpus.findIndex((e: { id: string }) => e.id === id);
  if (idx === -1) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }
  corpus[idx].status = status;
  writeCorpus(corpus);
  return Response.json(corpus[idx]);
}
