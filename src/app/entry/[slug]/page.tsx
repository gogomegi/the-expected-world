import { notFound } from "next/navigation";
import { getEntryById, getAllEntries, getRelatedEntries, categoryToSlug } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return getAllEntries().map(e => ({ slug: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryById(slug);
  if (!entry) return {};
  return { title: `${entry.author} — Predicted: ${entry.predictedDate}`, description: entry.annotation };
}

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryById(slug);
  if (!entry) notFound();
  const related = getRelatedEntries(entry, 3);
  const catSlug = categoryToSlug(entry.category);

  return (
    <div className="flex flex-col min-h-full">
      <header>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Link href="/" style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", letterSpacing: "0.08em" }}>The Expected World</Link>
          <nav style={{ display: "flex", gap: "2rem" }}>
            {[["/", "browse"], ["/timeline", "timeline"], ["/about", "about"]].map(([href, label]) => (
              <Link key={href} href={href} className="nav-link" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)", letterSpacing: "0.04em", transition: "color 150ms ease" }}>{label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div style={{ maxWidth: "var(--max-width-body)", margin: "0 auto", padding: "0 1.5rem 6rem" }}>
          <nav style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-secondary)", letterSpacing: "0.04em", paddingTop: "3rem", marginBottom: "3rem" }}>
            <Link href={`/category/${catSlug}`} className="breadcrumb-link" style={{ color: "var(--color-secondary)" }}>← {entry.category}</Link>
          </nav>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-accent)", letterSpacing: "0.04em", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(139,69,19,0.25)", marginBottom: "2rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span>Written: <time dateTime={entry.dateWritten}>{entry.dateWritten}</time></span>
            <span>Predicted: <time dateTime={entry.predictedDateNormalized}>{entry.predictedDateNormalized}</time></span>
          </div>

          <blockquote className="quote-block" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.375rem, 3vw, 1.875rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.6, color: "var(--color-text)", marginBottom: "2.5rem", paddingLeft: "1.25rem", border: "none" }}>
            {entry.quote}
          </blockquote>

          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>— {entry.author}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontStyle: "italic", color: "var(--color-secondary)" }}>{entry.source}</p>
            <hr style={{ border: "none", borderTop: "1px solid rgba(26,26,26,0.12)", marginTop: "3rem" }} />
          </div>

          <section style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", paddingTop: "2.5rem", marginBottom: "1rem" }}>Annotation</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--color-text)" }}>{entry.annotation}</p>
          </section>

          {entry.actualOutcome && (
            <section style={{ marginBottom: "3rem" }}>
              <hr style={{ border: "none", borderTop: "1px solid rgba(26,26,26,0.12)", marginBottom: 0 }} />
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", paddingTop: "2.5rem", marginBottom: "1rem" }}>What Actually Happened</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.7, color: "var(--color-secondary)" }}>{entry.actualOutcome}</p>
            </section>
          )}

          {entry.tags.length > 0 && (
            <div>
              <hr style={{ border: "none", borderTop: "1px solid rgba(26,26,26,0.12)", marginBottom: 0 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", padding: "2rem 0", fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em" }}>
                <Link href={`/category/${catSlug}`} style={{ color: "var(--color-accent)", textTransform: "uppercase" }}>{entry.category}</Link>
                {entry.tags.map(tag => <span key={tag} style={{ color: "var(--color-secondary)" }}>#{tag}</span>)}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <section>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", paddingTop: "2.5rem", marginBottom: "1.5rem" }}>Related Entries</p>
              {related.map((rel, idx) => (
                <Link key={rel.id} href={`/entry/${rel.id}`} style={{ display: "block" }}>
                  <div className="related-row" style={{ padding: "1.25rem 0", borderTop: "1px solid rgba(26,26,26,0.1)", borderBottom: idx === related.length - 1 ? "1px solid rgba(26,26,26,0.1)" : "none" }}>
                    <p className="related-quote" style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontStyle: "italic", color: "var(--color-text)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.375rem", transition: "color 150ms ease" }}>{rel.quote}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)", marginBottom: "0.25rem" }}>{rel.author}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-accent)" }}>Predicted: {rel.predictedDateNormalized}</p>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(26,26,26,0.12)", marginTop: "auto" }}>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "5rem 2rem 3rem", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
          <span>© The Expected World</span><span>Submissions &amp; Contact</span>
        </div>
      </footer>
      <style>{`.nav-link:hover{color:var(--color-text)!important;text-decoration:underline;text-underline-offset:3px}.breadcrumb-link:hover{color:var(--color-text)!important}.related-row:hover .related-quote{color:var(--color-accent)!important}`}</style>
    </div>
  );
}
