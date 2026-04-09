import { isAuthenticated } from "@/lib/admin-auth";
import { getAllQuotesRaw, saveQuote, deleteQuote, slugify } from "@/lib/quotes";
import type { Quote } from "@/types/quote";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getAllQuotesRaw());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const quote = (await request.json()) as Quote;
  if (!quote.slug) {
    quote.slug = slugify(`${quote.author}-${quote.text.slice(0, 30)}-${quote.yearWritten}`);
  }
  if (!quote.authorSlug) {
    quote.authorSlug = slugify(quote.author);
  }
  saveQuote(quote);
  return Response.json(quote, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const quote = (await request.json()) as Quote;
  saveQuote(quote);
  return Response.json(quote);
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slugs } = await request.json();
  const deleted = (slugs as string[]).filter((s) => deleteQuote(s));
  return Response.json({ deleted });
}
