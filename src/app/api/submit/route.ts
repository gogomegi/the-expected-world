import { addSubmission } from "@/lib/quotes";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const text = data.text || data.quote;
  if (!text || !data.author || !data.yearWritten) {
    return Response.json(
      { error: "Missing required fields: text (or quote), author, yearWritten" },
      { status: 400 }
    );
  }

  try {
    const submission = await addSubmission({
      text: String(text),
      author: String(data.author),
      source: String(data.source || ""),
      yearWritten: Number(data.yearWritten),
      yearImagined: data.yearImagined ? String(data.yearImagined) : undefined,
      topic: data.topic ? String(data.topic) : undefined,
      sourceUrl: data.sourceUrl ? String(data.sourceUrl) : undefined,
      annotation: data.annotation ? String(data.annotation) : undefined,
      actualOutcome: data.actualOutcome ? String(data.actualOutcome) : undefined,
      email: data.email ? String(data.email) : undefined,
    });

    return Response.json({ ok: true, id: submission.id }, { status: 201 });
  } catch (err) {
    console.error("Submit error:", err);
    return Response.json(
      { error: "Failed to save submission", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
