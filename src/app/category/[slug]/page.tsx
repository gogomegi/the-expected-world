import { notFound } from "next/navigation";
import { getEntriesByCategory, getCategoryBySlug, getAllCategories, isExpired } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return getAllCategories().map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/category/${slug}` },
  };
}

const ACCENTS = ["accent-orange", "accent-blue", "accent-green", ""] as const;

function accentForIndex(i: number) {
  return ACCENTS[i % ACCENTS.length];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const entries = getEntriesByCategory(slug);

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section
        className="grid-bg"
        style={{
          background: "var(--black)",
          padding: "160px 48px 80px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.75rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--text-on-dark)",
            margin: "0 0 20px",
          }}
        >
          {category.name}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-quote)",
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "var(--muted-dark)",
            maxWidth: "540px",
            margin: "0 auto 16px",
            lineHeight: 1.5,
          }}
        >
          {category.description}
        </p>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            letterSpacing: "0.06em",
            color: "var(--muted-dark)",
          }}
        >
          {entries.length} entries
        </span>
      </section>

      {/* ═══ ENTRIES — cream section ═══ */}
      <section
        style={{
          background: "var(--cream)",
          color: "var(--text-on-light)",
          padding: "80px 48px 120px",
        }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {entries.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--muted-light)",
              }}
            >
              No passages indexed for this category yet. Submissions are open.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "4px",
              }}
            >
              {entries.map((entry, i) => {
                const accent = accentForIndex(i);
                const expired = isExpired(entry.predictedDateNormalized);
                return (
                  <Link
                    key={entry.id}
                    href={`/entry/${entry.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className={`card-light ${accent}`}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.5625rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--muted-light)",
                            }}
                          >
                            {expired ? "expires" : "closing"}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-heading)",
                              fontSize: "1.75rem",
                              fontWeight: 900,
                              color: "var(--text-on-light)",
                              lineHeight: 1,
                            }}
                          >
                            {entry.predictedDateNormalized.slice(0, 4)}
                          </span>
                        </div>
                        {entry.is_fiction && <span className="fiction-badge">fiction</span>}
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-quote)",
                          fontStyle: "italic",
                          fontSize: "1rem",
                          lineHeight: 1.45,
                          color: "var(--text-on-light)",
                          opacity: 0.8,
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          marginBottom: "20px",
                        }}
                      >
                        {entry.quote}
                      </p>
                      <div
                        style={{
                          paddingTop: "16px",
                          borderTop: "1px solid var(--rule-light)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "var(--text-on-light)",
                          }}
                        >
                          {entry.author}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.5625rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--muted-light)",
                          }}
                        >
                          {entry.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
