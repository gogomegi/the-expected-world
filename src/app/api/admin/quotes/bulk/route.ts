import { isAuthenticated } from "@/lib/admin-auth";
import { getQuoteBySlugRaw, saveQuote, deleteQuote } from "@/lib/quotes";
import type { QuoteStatus } from "@/types/quote";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { action, slugs, value } = await request.json() as {
    action: "publish" | "change-category" | "delete" | "change-status";
    slugs: string[];
    value?: string;
  };

  const results: string[] = [];

  for (const slug of slugs) {
    const quote = getQuoteBySlugRaw(slug);
    if (!quote) continue;

    switch (action) {
      case "publish":
        quote.status = "published";
        saveQuote(quote);
        results.push(slug);
        break;
      case "change-status":
        quote.status = value as QuoteStatus;
        saveQuote(quote);
        results.push(slug);
        break;
      case "change-category":
        if (value && !quote.categories.includes(value)) {
          quote.categories.push(value);
        }
        saveQuote(quote);
        results.push(slug);
        break;
      case "delete":
        if (deleteQuote(slug)) results.push(slug);
        break;
    }
  }

  return Response.json({ action, affected: results });
}
