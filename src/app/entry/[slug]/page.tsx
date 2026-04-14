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
  const description = entry.annotation.length > 160
    ? entry.annotation.slice(0, 157) + "…"
    : entry.annotation;
  return {
    title,
    description,
    alternates: {
      canonical: `/entry/${entry.id}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      authors: [entry.author],
    },
  };
}

function extractYear(dateStr: string): string {
  return dateStr.slice(0, 4);
}

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryById(slug);
  if (!entry) notFound();
  const related = getRelatedEntries(entry, 3);
  const catSlug = categoryToSlug(entry.category);

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
    <div style={{ paddingBottom: "var(--space-7)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Two-column entry layout */}
      <div className="entry-grid" style={{ paddingTop: "var(--space-8)" }}>
        {/* LEFT COLUMN: Quote */}
        <div className="entry-grid-left">
          {/* EXPIRES date — large, Vermillion, semantic H1 */}
          <h1
            style={{
              fontFamily: "var(--font-chrome)",
              fontSize: "clamp(3rem, 5vw, var(--text-date-display))",
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "var(--color-accent)",
              margin: 0,
            }}
          >
            {isExpired(entry.predictedDateNormalized) ? "EXPIRES" : "CLOSING"}: {displayYear(entry)}
          </h1>

          {/* WRITTEN date — small, faded */}
          <p
            style={{
              fontFamily: "var(--font-chrome)",
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "var(--color-secondary)",
              opacity: 0.4,
              marginTop: "var(--space-1)",
              marginBottom: "var(--space-5)",
            }}
          >
            WRITTEN: {entry.dateWritten}
          </p>

          {/* The passage */}
          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, var(--text-quote))",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.4,
              color: "var(--color-text)",
              margin: 0,
              padding: 0,
              border: "none",
              marginBottom: "var(--space-4)",
            }}
          >
            {entry.quote}
          </blockquote>

          {/* Attribution */}
          <div style={{ marginBottom: "var(--space-5)", overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                letterSpacing: "0.04em",
                color: "var(--color-secondary)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {entry.author}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                letterSpacing: "0.04em",
                color: "var(--color-secondary)",
                lineHeight: 1.5,
                margin: 0,
                marginTop: "2px",
                wordBreak: "break-word",
              }}
            >
              {entry.source}
            </p>
            {entry.is_fiction && (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-chrome)",
                  fontSize: "0.5625rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "var(--color-secondary)",
                  border: "1px solid rgba(120, 113, 103, 0.3)",
                  padding: "2px 8px",
                  borderRadius: "1px",
                  marginTop: "8px",
                }}
              >
                FICTION
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Apparatus */}
        <div className="entry-grid-right">
          {/* Full metadata block */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              letterSpacing: "0.04em",
              color: "var(--color-secondary)",
              lineHeight: 1.8,
              marginBottom: "var(--space-5)",
              paddingTop: "var(--space-1)",
            }}
          >
            <p style={{ margin: 0 }}>
              Written: {entry.dateWritten}
            </p>
            <p style={{ margin: 0 }}>
              Addressed to: {entry.predictedDate}
            </p>
            <p style={{ margin: 0 }}>
              Source: {entry.source.split(",")[0]}
            </p>
            <p style={{ margin: 0 }}>
              Author: {entry.author}
            </p>
            <p style={{ margin: 0 }}>
              Category:{" "}
              <Link
                href={`/category/${catSlug}`}
                style={{ color: "var(--color-accent)" }}
              >
                {entry.category}
              </Link>
            </p>
          </div>

          {/* Annotation */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(120, 113, 103, 0.2)",
              marginBottom: "var(--space-3)",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-chrome)",
              fontSize: "var(--text-ui)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--color-secondary)",
              textTransform: "uppercase",
              marginBottom: "var(--space-2)",
            }}
          >
            Annotation
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sidebar)",
              lineHeight: 1.65,
              color: "var(--color-text)",
              marginBottom: "var(--space-5)",
            }}
          >
            {entry.annotation}
          </p>

          {/* What actually happened */}
          {entry.actualOutcome && (
            <>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(120, 113, 103, 0.2)",
                  marginBottom: "var(--space-3)",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-chrome)",
                  fontSize: "var(--text-ui)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "var(--color-secondary)",
                  textTransform: "uppercase",
                  marginBottom: "var(--space-2)",
                }}
              >
                What Actually Happened
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sidebar)",
                  lineHeight: 1.65,
                  color: "var(--color-secondary)",
                  marginBottom: "var(--space-5)",
                }}
              >
                {entry.actualOutcome}
              </p>
            </>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-1)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                letterSpacing: "0.04em",
                color: "var(--color-secondary)",
              }}
            >
              {entry.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Related entries */}
          {related.length > 0 && (
            <div style={{ marginTop: "var(--space-6)" }}>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(120, 113, 103, 0.2)",
                  marginBottom: "var(--space-3)",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-chrome)",
                  fontSize: "var(--text-ui)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "var(--color-secondary)",
                  textTransform: "uppercase",
                  marginBottom: "var(--space-2)",
                }}
              >
                Related
              </p>
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/entry/${rel.id}`}
                  style={{
                    display: "block",
                    paddingBottom: "var(--space-2)",
                    marginBottom: "var(--space-2)",
                    borderBottom: "1px solid rgba(120, 113, 103, 0.1)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      letterSpacing: "0.04em",
                      color: "var(--color-accent)",
                      margin: 0,
                      marginBottom: "2px",
                    }}
                  >
                    {extractYear(rel.predictedDateNormalized)}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sidebar)",
                      color: "var(--color-text)",
                      lineHeight: 1.5,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {rel.quote}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      letterSpacing: "0.04em",
                      color: "var(--color-secondary)",
                      margin: 0,
                      marginTop: "2px",
                    }}
                  >
                    {rel.author}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
