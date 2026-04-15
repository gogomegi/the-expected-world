import { notFound } from "next/navigation";
import {
  getEntryBySlug,
  getAllEntries,
  getRelatedEntries,
  categoryToSlug,
  isExpired,
  displayYear,
} from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";
import PaintCanvas from "@/components/PaintCanvas";
import CounterYear from "@/components/CounterYear";
import ScrollReveal from "@/components/ScrollReveal";

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
function hoverColorForIndex(i: number): string {
  return COLOR_VARS[i % COLOR_VARS.length];
}

export async function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};
  const label = isExpired(entry.predictedDateNormalized) ? "Expires" : "Closing";
  const title = `${entry.author} — ${label}: ${entry.yearImagined} | The Expected World`;
  const annotation = entry.annotation || "";
  const description =
    annotation.length > 160
      ? annotation.slice(0, 157) + "…"
      : annotation;
  return {
    title,
    description,
    alternates: {
      canonical: `/entry/${entry.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      authors: [entry.author],
    },
  };
}

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const related = getRelatedEntries(entry, 3);
  const catSlug = categoryToSlug(entry.categories[0] || "");
  const expired = isExpired(entry.predictedDateNormalized);
  const yearStr = displayYear(entry);
  const vividColor = colorForEntry(entry.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${entry.author}: ${entry.text.slice(0, 110)}`,
    author: { "@type": "Person", name: entry.author },
    datePublished: String(entry.yearWritten),
    description: entry.annotation,
    publisher: {
      "@type": "Organization",
      name: "The Expected World",
      url: "https://theexpectedworld.com",
    },
    mainEntityOfPage: `https://theexpectedworld.com/entry/${entry.slug}`,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── ENTRY HERO ── */}
      <section
        className="grid-bg"
        style={{
          padding: "160px 48px 0",
          background: "var(--black)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <PaintCanvas />
        <ScrollReveal delay={0}>
          <div className="entry-hero-grid">
            {/* LEFT: Expires column */}
            <div
              className="entry-exp-col"
              style={{ background: vividColor }}
            >
              <div>
                <span
                  className="section-label"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {expired ? "expires" : "closing"}
                </span>
                <div style={{ marginTop: 8 }}>
                  <CounterYear year={parseInt(yearStr) || 0} />
                </div>
              </div>
              <div style={{ marginTop: "auto" }}>
                <div
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.06em",
                    lineHeight: 2,
                  }}
                >
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                      Written
                    </span>
                    <br />
                    <span style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}>
                      {entry.yearWritten}
                    </span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                      Addressed to
                    </span>
                    <br />
                    <span style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}>
                      {entry.yearImagined}
                    </span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                      Category
                    </span>
                    <br />
                    <Link
                      href={`/category/${catSlug}`}
                      style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}
                    >
                      {entry.categories[0]}
                    </Link>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                      Status
                    </span>
                    <br />
                    <span style={{ color: "var(--text-d)", fontFamily: "var(--fh)", fontWeight: 500, fontSize: "0.8125rem" }}>
                      {expired ? "Expired" : "Closing"}
                    </span>
                  </div>
                </div>
                {entry.isFiction && (
                  <span
                    className="fiction-badge"
                    style={{ marginTop: 16, marginLeft: 0, borderColor: "rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.7)" }}
                  >
                    FICTION
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: Quote column */}
            <div
              style={{
                background: "#0A0A0A",
                padding: "64px 56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--fq)",
                  fontSize: "2rem",
                  fontStyle: "italic",
                  fontWeight: 400,
                  lineHeight: 1.45,
                  color: "var(--text-d)",
                  margin: 0,
                }}
              >
                &ldquo;{entry.text}&rdquo;
              </h1>
              <p
                style={{
                  fontFamily: "var(--fh)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "var(--text-d)",
                  marginTop: 24,
                }}
              >
                {entry.author}
              </p>
              <p
                style={{
                  fontFamily: "var(--fm)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.04em",
                  color: "var(--muted-d)",
                  marginTop: 4,
                }}
              >
                {entry.source}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── ANNOTATION SECTION ── */}
      <section
        style={{
          padding: "80px 48px",
          background: "var(--cream)",
        }}
      >
        <div className="entry-anno-grid">
          {/* LEFT: Annotation */}
          <div>
            <h2
              style={{
                fontFamily: "var(--fh)",
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-l)",
                marginBottom: 20,
              }}
            >
              Annotation
            </h2>
            <p
              style={{
                fontFamily: "var(--fq)",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-l)",
                opacity: 0.8,
              }}
            >
              {entry.annotation}
            </p>
          </div>

          {/* RIGHT: What Actually Happened */}
          {entry.didItHoldUp?.analysis && (
            <div>
              <h2
                style={{
                  fontFamily: "var(--fh)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: vividColor,
                  marginBottom: 20,
                }}
              >
                What Actually Happened
              </h2>
              <div
                style={{
                  borderLeft: `3px solid var(--blue)`,
                  paddingLeft: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--fq)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "var(--text-l)",
                    opacity: 0.8,
                  }}
                >
                  {entry.didItHoldUp?.analysis}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div
            style={{
              maxWidth: "var(--max-width)",
              margin: "40px auto 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
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
            <h3
              style={{
                fontFamily: "var(--fh)",
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-l)",
                marginBottom: 24,
              }}
            >
              Related Entries
            </h3>
            <div className="entry-related-grid">
              {related.map((rel, i) => {
                const relYear = displayYear(rel);
                const relColor = hoverColorForIndex(i);
                return (
                  <Link key={rel.slug} href={`/entry/${rel.slug}`}>
                    <div className="ac-light">
                      <div
                        className="ac-hover-bg"
                        style={{ background: relColor }}
                      />
                      <span className="ac-ghost">{relYear}</span>
                      <div
                        className="ac-top"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 16,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="ac-el"
                          style={{
                            fontFamily: "var(--fm)",
                            fontSize: "0.5625rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--muted-l)",
                          }}
                        >
                          {isExpired(rel.predictedDateNormalized) ? "expires" : "closing"}
                        </span>
                        <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
                          <CounterYear year={parseInt(relYear) || 0} />
                        </span>
                      </div>
                      <p
                        className="ac-excerpt"
                        style={{
                          fontFamily: "var(--fq)",
                          fontStyle: "italic",
                          fontSize: "0.9375rem",
                          lineHeight: 1.55,
                          color: "var(--text-l)",
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        &ldquo;{rel.text}&rdquo;
                      </p>
                      <div
                        className="ac-bottom"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 16,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="ac-auth"
                          style={{
                            fontFamily: "var(--fh)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: "var(--text-l)",
                          }}
                        >
                          {rel.author}
                        </span>
                        <span
                          className="ac-cat"
                          style={{
                            fontFamily: "var(--fm)",
                            fontSize: "0.5625rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--muted-l)",
                          }}
                        >
                          {rel.categories[0]}
                        </span>
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
