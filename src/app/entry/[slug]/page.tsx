import { notFound } from "next/navigation";
import {
  getEntryById,
  getAllEntries,
  getRelatedEntries,
  categoryToSlug,
  isExpired,
  displayYear,
} from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryById(slug);
  if (!entry) return {};
  const label = isExpired(entry.predictedDateNormalized) ? "Expires" : "Closing";
  const title = `${entry.author} — ${label}: ${entry.predictedDate}`;
  const description =
    entry.annotation.length > 160
      ? entry.annotation.slice(0, 157) + "…"
      : entry.annotation;
  return {
    title,
    description,
    alternates: { canonical: `/entry/${entry.id}` },
    openGraph: {
      title,
      description,
      type: "article",
      authors: [entry.author],
    },
  };
}

const ENTRY_COLORS = [
  "var(--vivid-blue)",
  "var(--vivid-orange)",
  "var(--vivid-green)",
  "var(--vivid-amber)",
];

function colorForEntry(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ENTRY_COLORS[Math.abs(hash) % ENTRY_COLORS.length];
}

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryById(slug);
  if (!entry) notFound();
  const related = getRelatedEntries(entry, 3);
  const catSlug = categoryToSlug(entry.category);
  const entryColor = colorForEntry(entry.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${entry.author}: ${entry.quote.slice(0, 110)}`,
    author: { "@type": "Person", name: entry.author },
    datePublished: entry.dateWritten,
    description: entry.annotation,
    publisher: {
      "@type": "Organization",
      name: "The Expected World",
      url: "https://theexpectedworld.com",
    },
    mainEntityOfPage: `https://theexpectedworld.com/entry/${entry.id}`,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ ENTRY HERO — two-column split ═══ */}
      <section
        className="grid-bg"
        style={{ padding: "160px 48px 0", background: "var(--black)" }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "4px", marginBottom: "4px" }}>
            {/* Left: EXPIRES color block */}
            <div
              style={{
                background: entryColor,
                padding: "64px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span className="section-label" style={{ color: "rgba(255,255,255,0.6)", marginBottom: "8px", display: "block" }}>
                  {isExpired(entry.predictedDateNormalized) ? "expires" : "closing"}
                </span>
                <h1
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(4rem, 9vw, 8rem)",
                    fontWeight: 900,
                    lineHeight: 0.85,
                    color: "var(--white)",
                    letterSpacing: "-0.03em",
                    marginBottom: "32px",
                  }}
                >
                  {displayYear(entry)}
                </h1>
              </div>

              <div style={{ marginTop: "auto" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span className="section-label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block" }}>
                    written
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--white)",
                    }}
                  >
                    {entry.dateWritten}
                  </span>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <span className="section-label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block" }}>
                    addressed to
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--white)",
                    }}
                  >
                    {entry.predictedDate}
                  </span>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <span className="section-label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block" }}>
                    category
                  </span>
                  <Link
                    href={`/category/${catSlug}`}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--white)",
                    }}
                  >
                    {entry.category}
                  </Link>
                </div>
                {entry.is_fiction && (
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(255,255,255,0.4)",
                      padding: "4px 10px",
                      color: "var(--white)",
                    }}
                  >
                    fiction
                  </span>
                )}
              </div>
            </div>

            {/* Right: quote on dark */}
            <div
              style={{
                background: "#0A0A0A",
                padding: "64px 56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-quote)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
                  lineHeight: 1.4,
                  color: "var(--text-on-dark)",
                  marginBottom: "40px",
                }}
              >
                {entry.quote}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--text-on-dark)",
                  marginBottom: "8px",
                }}
              >
                {entry.author}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  color: "var(--muted-dark)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                }}
              >
                {entry.source}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANNOTATION — cream section ═══ */}
      <section
        style={{
          background: "var(--cream)",
          color: "var(--text-on-light)",
          padding: "80px 48px",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-on-light)",
                marginBottom: "24px",
              }}
            >
              Annotation
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-on-light)",
                opacity: 0.8,
              }}
            >
              {entry.annotation}
            </p>
          </div>

          {entry.actualOutcome && (
            <div
              style={{
                paddingLeft: "24px",
                borderLeft: `3px solid ${entryColor}`,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: entryColor,
                  marginBottom: "16px",
                }}
              >
                What Actually Happened
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "var(--text-on-light)",
                  opacity: 0.7,
                }}
              >
                {entry.actualOutcome}
              </p>
            </div>
          )}
        </div>

        {/* Tags + related */}
        {(entry.tags.length > 0 || related.length > 0) && (
          <div
            style={{
              maxWidth: "var(--max-width)",
              margin: "64px auto 0",
              paddingTop: "40px",
              borderTop: "1px solid var(--rule-light)",
            }}
          >
            {entry.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: related.length > 0 ? "40px" : 0,
                }}
              >
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.625rem",
                      letterSpacing: "0.06em",
                      color: "var(--muted-light)",
                      border: "1px solid var(--rule-light)",
                      padding: "4px 10px",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {related.length > 0 && (
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-on-light)",
                    marginBottom: "24px",
                  }}
                >
                  Related Entries
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(related.length, 3)}, 1fr)`,
                    gap: "4px",
                  }}
                >
                  {related.map((rel, i) => (
                    <Link key={rel.id} href={`/entry/${rel.id}`}>
                      <div
                        className={`card-light accent-${["orange", "blue", "green"][i % 3]}`}
                        style={{ minHeight: "200px" }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-light)" }}>
                            {isExpired(rel.predictedDateNormalized) ? "expires" : "closing"}
                          </span>
                          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 900, color: "var(--text-on-light)" }}>
                            {rel.predictedDateNormalized.slice(0, 4)}
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--font-quote)", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.45, color: "var(--text-on-light)", opacity: 0.8, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "12px" }}>
                          {rel.quote}
                        </p>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-on-light)" }}>
                          {rel.author}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
