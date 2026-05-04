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
import CounterYear from "@/components/CounterYear";

interface Props {
  params: Promise<{ slug: string }>;
}

const ENTRY_COLORS = ["var(--blue)", "var(--orange)", "var(--green)", "var(--amber)"];
function colorForEntry(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ENTRY_COLORS[Math.abs(hash) % ENTRY_COLORS.length];
}

const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

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
    openGraph: { title, description, type: "article", authors: [entry.author] },
  };
}

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryById(slug);
  if (!entry) notFound();

  const related = getRelatedEntries(entry, 3);
  const catSlug = categoryToSlug(entry.category);
  const expired = isExpired(entry.predictedDateNormalized);
  const yearStr = displayYear(entry);
  const vividColor = colorForEntry(entry.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${entry.author}: ${entry.quote.slice(0, 110)}`,
    author: { "@type": "Person", name: entry.author },
    datePublished: entry.dateWritten,
    description: entry.annotation,
    articleSection: entry.category,
    publisher: {
      "@type": "Organization",
      name: "The Expected World",
      url: "https://theexpectedworld.com",
      logo: { "@type": "ImageObject", url: "https://theexpectedworld.com/favicon.svg" },
    },
    mainEntityOfPage: `https://theexpectedworld.com/entry/${entry.id}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://theexpectedworld.com" },
      { "@type": "ListItem", position: 2, name: entry.category, item: `https://theexpectedworld.com/category/${catSlug}` },
      { "@type": "ListItem", position: 3, name: `${entry.author} — ${entry.predictedDate}` },
    ],
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }}
      />

      {/* ── QUOTE CARD (white on cream) ── */}
      <section style={{ padding: "120px 48px 0" }}>
        <div className="phone-frame-outer" style={{ maxWidth: "960px" }}>
          <div className="phone-frame-inner" style={{ padding: 0, overflow: "hidden" }}>
            <div className="entry-hero-grid">
              {/* LEFT: Meta column */}
              <div
                className="entry-exp-col"
                style={{ background: vividColor }}
              >
                <div>
                  <span className="section-label" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {expired ? "expires" : "gate is closing"}
                  </span>
                  <div style={{ marginTop: 8 }}>
                    <CounterYear year={parseInt(yearStr) || 0} />
                  </div>
                </div>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.6875rem", letterSpacing: "0.06em", lineHeight: 2 }}>
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Written</span>
                      <br />
                      <span style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}>{entry.dateWritten}</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Addressed to</span>
                      <br />
                      <span style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}>{entry.predictedDate}</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Category</span>
                      <br />
                      <Link href={`/category/${catSlug}`} style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}>
                        {entry.category}
                      </Link>
                    </div>
                  </div>
                  {entry.is_fiction && (
                    <span className="fiction-badge" style={{ marginTop: 16, marginLeft: 0, borderColor: "rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.7)" }}>FICTION</span>
                  )}
                </div>
              </div>

              {/* RIGHT: Quote on white */}
              <div
                className="entry-quote-col"
                style={{
                  background: "var(--white)",
                  padding: "64px 56px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h1
                  className="entry-quote-text"
                  style={{
                    fontFamily: "var(--fq)",
                    fontSize: "1.125rem",
                    fontStyle: "italic",
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: "var(--text-l)",
                    margin: 0,
                  }}
                >
                  &ldquo;{entry.quote}&rdquo;
                </h1>
                <p style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-l)", marginTop: 24 }}>
                  {entry.author}
                </p>
                <p style={{ fontFamily: "var(--fm)", fontSize: "0.6875rem", letterSpacing: "0.04em", color: "var(--muted-l)", marginTop: 4 }}>
                  {entry.source}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANNOTATION + WHAT ACTUALLY HAPPENED ── */}
      <section style={{ padding: "64px 48px 80px" }}>
        <div className="entry-anno-grid">
          <div>
            <h2 style={sectionHeadStyle}>Annotation</h2>
            <p style={bodyStyle}>{entry.annotation}</p>
          </div>

          {entry.actualOutcome && (
            <div>
              <h2 style={{ ...sectionHeadStyle, color: vividColor }}>What Actually Happened</h2>
              <div style={{ borderLeft: `3px solid ${vividColor}`, paddingLeft: 20 }}>
                <p style={bodyStyle}>{entry.actualOutcome}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div style={{ maxWidth: "var(--max-width)", margin: "40px auto 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {entry.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--fm)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.04em",
                  color: "var(--muted-l)",
                  border: "1px solid var(--rule-l)",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related entries */}
        {related.length > 0 && (
          <div style={{ maxWidth: "var(--max-width)", margin: "64px auto 0" }}>
            <h3 style={sectionHeadStyle}>Related Entries</h3>
            <div className="entry-related-grid">
              {related.map((rel, i) => {
                const relYear = displayYear(rel);
                const relColor = COLOR_VARS[i % COLOR_VARS.length];
                return (
                  <Link key={rel.id} href={`/entry/${rel.id}`}>
                    <div className="ac-light">
                      <div className="ac-hover-bg" style={{ background: relColor }} />
                      <span className="ac-ghost">{relYear}</span>
                      <div className="ac-top" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, position: "relative", zIndex: 1 }}>
                        <span className="ac-el" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-l)" }}>
                          {isExpired(rel.predictedDateNormalized) ? "expires" : "closing"}
                        </span>
                        <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
                          <CounterYear year={parseInt(relYear) || 0} />
                        </span>
                      </div>
                      <p className="ac-excerpt" style={{ fontFamily: "var(--fq)", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.55, color: "var(--text-l)", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", position: "relative", zIndex: 1 }}>
                        &ldquo;{rel.quote}&rdquo;
                      </p>
                      <div className="ac-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, position: "relative", zIndex: 1 }}>
                        <span className="ac-auth" style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.75rem", color: "var(--text-l)" }}>{rel.author}</span>
                        <span className="ac-cat" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-l)" }}>{rel.category}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "var(--fh)",
  fontWeight: 800,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--text-l)",
  marginBottom: 16,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--fq)",
  fontSize: "0.9375rem",
  lineHeight: 1.75,
  color: "var(--text-l)",
  opacity: 0.8,
};
