import { isAuthenticated } from "@/lib/admin-auth";
import {
  getAllSubmissions,
  updateSubmissionStatus,
  getSubmissionById,
  saveQuote,
  slugify,
} from "@/lib/quotes";
import { commitFileToGitHub, readFileFromGitHub } from "@/lib/github-commit";
import type { Quote } from "@/types/quote";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return Response.json(await getAllSubmissions());
  } catch (err) {
    console.error("Failed to fetch submissions:", err);
    return Response.json(
      { error: "Failed to load submissions", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, action } = await request.json() as {
    id: string;
    action: "approve" | "reject";
  };

  if (action === "reject") {
    await updateSubmissionStatus(id, "rejected");
    return Response.json({ ok: true });
  }

  // Approve: convert submission to quote and corpus entry
  const sub = await getSubmissionById(id);
  if (!sub) return Response.json({ error: "Not found" }, { status: 404 });

  const entrySlug = slugify(`${sub.author}-${sub.text.slice(0, 30)}-${sub.yearWritten}`);

  const quote: Quote = {
    slug: entrySlug,
    text: sub.text,
    author: sub.author,
    authorSlug: slugify(sub.author),
    source: sub.source,
    sourceUrl: sub.sourceUrl,
    yearWritten: sub.yearWritten,
    yearImagined: sub.yearImagined || "Unknown",
    categories: sub.topic ? [sub.topic] : [],
    status: "published",
    quoteSource: "user-submission",
  };

  // Corpus entry for /entry/[slug] pages
  const corpusEntry = {
    id: entrySlug,
    quote: sub.text,
    author: sub.author,
    source: sub.source,
    dateWritten: String(sub.yearWritten),
    predictedDate: sub.yearImagined || "Unknown",
    predictedDateNormalized: sub.yearImagined
      ? `${sub.yearImagined.replace(/\D/g, "").slice(0, 4).padEnd(4, "0")}-01-01`
      : "2100-01-01",
    category: sub.topic || "Culture & Society",
    annotation: "",
    actualOutcome: "",
    tags: [],
    source_type: "human" as const,
    status: "confirmed" as const,
    verification_status: "unverified" as const,
    source_url: sub.sourceUrl || "",
    is_fiction: false,
  };

  if (process.env.GITHUB_TOKEN) {
    // 1. Commit quote file
    const quoteResult = await commitFileToGitHub({
      path: `src/data/quotes/${quote.slug}.json`,
      content: JSON.stringify(quote, null, 2),
      message: `Publish approved submission: ${quote.author} (${quote.yearWritten})`,
    });
    if (!quoteResult.ok) {
      return Response.json(
        { error: "Failed to publish quote", detail: quoteResult.error },
        { status: 500 }
      );
    }

    // 2. Add to corpus.json so it appears on /entry/[slug] pages
    const corpusFile = await readFileFromGitHub("src/data/corpus.json");
    if (corpusFile) {
      const corpus = JSON.parse(corpusFile.content);
      // Avoid duplicates
      if (!corpus.some((e: { id: string }) => e.id === corpusEntry.id)) {
        corpus.push(corpusEntry);
        const corpusResult = await commitFileToGitHub({
          path: "src/data/corpus.json",
          content: JSON.stringify(corpus, null, 2),
          message: `Add ${quote.author} to corpus`,
        });
        if (!corpusResult.ok) {
          console.error("Failed to update corpus:", corpusResult.error);
          // Non-fatal — quote file was already committed
        }
      }
    }
  } else {
    saveQuote(quote);
  }

  await updateSubmissionStatus(id, "approved");
  return Response.json({ ok: true, quote });
}
