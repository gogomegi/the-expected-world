import { notFound } from "next/navigation";
import { getEntriesByCategory, getCategoryBySlug, getAllCategories, isExpired, displayYear } from "@/lib/corpus";
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

const COLORS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const entries = getEntriesByCategory(slug);
  const allCategories = getAllCategories();
  const otherCategories = allCategories.filter(c => c.slug !== slug);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Header section */}
      <section style={{ padding: "120px 48px 64px", maxWidth: 800, margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--fm)",
          fontSize: "0.5625rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted-l)",
          marginBottom: 12,
        }}>
          Category
        </p>
        <h1 style={{
          fontFamily: "var(--fh)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--text-l)",
          margin: 0,
        }}>
          {category.name}
        </h1>
        <p style={{
          fontFamily: "var(--fq)",
          fontStyle: "italic",
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "var(--text-l)",
          opacity: 0.6,
          marginTop: 16,
          maxWidth: 600,
        }}>
          {category.description}
        </p>
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid var(--rule-l)",
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}>
          <span style={{
            fontFamily: "var(--fm)",
            fontSize: "0.6875rem",
            letterSpacing: "0.04em",
            color: "var(--muted-l)",
          }}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </section>

      {/* Entries list */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 48px 64px" }}>
        {entries.length === 0 ? (
          <div style={{
            padding: "48px 0",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "var(--fq)",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "var(--text-l)",
              opacity: 0.5,
              marginBottom: 16,
            }}>
              No entries in this category yet.
            </p>
            <p style={{
              fontFamily: "var(--fm)",
              fontSize: "0.6875rem",
              letterSpacing: "0.04em",
              color: "var(--muted-l)",
            }}>
              More predictions are being added regularly.{" "}
              <Link href="/submit" style={{ color: "var(--orange)", textDecoration: "underline" }}>
                Submit one
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {entries.map((entry, i) => {
              const color = COLORS[i % COLORS.length];
              const year = displayYear(entry);
              const expired = isExpired(entry.predictedDateNormalized);
              return (
                <Link key={entry.id} href={`/entry/${entry.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "28px 0",
                    borderBottom: "1px solid var(--rule-l)",
                    display: "grid",
                    gridTemplateColumns: "56px 1fr",
                    gap: 20,
                    alignItems: "start",
                    transition: "background 150ms",
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <span style={{
                        fontFamily: "var(--fh)",
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color,
                      }}>
                        {expired ? "exp" : "clos"}
                      </span>
                      <div style={{
                        fontFamily: "var(--fh)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--text-l)",
                        lineHeight: 1.2,
                        marginTop: 2,
                      }}>
                        {year}
                      </div>
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "var(--fq)",
                        fontStyle: "italic",
                        fontSize: "0.9375rem",
                        lineHeight: 1.55,
                        color: "var(--text-l)",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        &ldquo;{entry.quote}&rdquo;
                      </p>
                      <div style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}>
                        <span style={{
                          fontFamily: "var(--fh)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--text-l)",
                        }}>
                          {entry.author}
                        </span>
                        <span style={{
                          fontFamily: "var(--fm)",
                          fontSize: "0.625rem",
                          letterSpacing: "0.04em",
                          color: "var(--muted-l)",
                        }}>
                          {entry.dateWritten}
                        </span>
                        {entry.is_fiction && (
                          <span className="fiction-badge">FICTION</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Other categories */}
      <section style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "48px 48px 96px",
        borderTop: "1px solid var(--rule-l)",
      }}>
        <p style={{
          fontFamily: "var(--fh)",
          fontSize: "0.6875rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted-l)",
          marginBottom: 16,
        }}>
          Other categories
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {otherCategories.map(c => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.6875rem",
                letterSpacing: "0.04em",
                color: "var(--text-l)",
                padding: "6px 14px",
                border: "1px solid var(--rule-l)",
                borderRadius: 20,
                transition: "border-color 150ms, color 150ms",
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
