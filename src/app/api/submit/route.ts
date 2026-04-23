import { addSubmission } from "@/lib/quotes";

export async function POST(request: Request) {
  const data = await request.json();

  const text = data.text || data.quote;
  if (!text || !data.author || !data.yearWritten) {
    return Response.json(
      { error: "Missing required fields: text (or quote), author, yearWritten" },
      { status: 400 }
    );
  }

  const submission = addSubmission({
    text,
    author: data.author,
    source: data.source || "",
    yearWritten: Number(data.yearWritten),
    yearImagined: data.yearImagined,
    topic: data.topic,
    sourceUrl: data.sourceUrl,
    email: data.email,
  });

  return Response.json({ ok: true, id: submission.id }, { status: 201 });
}
