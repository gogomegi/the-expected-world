import { isAuthenticated } from "@/lib/admin-auth";
import {
  getAllSubmissions,
  updateSubmissionStatus,
  getSubmissionById,
  saveQuote,
  slugify,
} from "@/lib/quotes";
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

  // Approve: convert submission to quote
  const sub = await getSubmissionById(id);
  if (!sub) return Response.json({ error: "Not found" }, { status: 404 });

  const quote: Quote = {
    slug: slugify(`${sub.author}-${sub.text.slice(0, 30)}-${sub.yearWritten}`),
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

  saveQuote(quote);
  await updateSubmissionStatus(id, "approved");
  return Response.json({ ok: true, quote });
}
