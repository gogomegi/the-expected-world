import { getClosingEntries, timeRemaining, displayYear } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gate is Closing",
  description: "Predictions addressed to dates that have not yet arrived.",
  alternates: { canonical: "/closing" },
};

const BG_COLORS = ["var(--vivid-amber)", "var(--vivid-green)"] as const;

function bgForIndex(i: number) {
  return BG_COLORS[i % BG_COLORS.length];
}

export default function ClosingPage() {
  const entries = getClosingEntries();

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
          Gate is Closing
        </h1>
        <p
          style={{
            fontFamily: "var(--font-quote)",
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "var(--muted-dark)",
            maxWidth: "540px",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Predictions addressed to dates that have not yet arrived.
        </p>
      </section>

      {/* ═══ CLOSING CARDS ═══ */}
      <section
        className="grid-bg"
        style={{
          background: "var(--black)",
          padding: "80px 48px 120px",
        }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {entries.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--muted-dark)",
              }}
            >
              No predictions with future dates in the confirmed corpus yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "4px",
              }}
            >
              {entries.map((entry, i) => (
                <Link
                  key={entry.id}
                  href={`/entry/${entry.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: bgForIndex(i),
                      padding: "40px",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "300px",
                      cursor: "pointer",
                      transition: "opacity 0.25s",
                    }}
                  >
                    <span
                      className="section-label"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "8px",
                      }}
                    >
                      closing
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "3.5rem",
                        fontWeight: 900,
                        color: "var(--white)",
                        lineHeight: 1,
                        marginBottom: "12px",
                      }}
                    >
                      {displayYear(entry)}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6875rem",
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "20px",
                      }}
                    >
                      {timeRemaining(entry.predictedDateNormalized)}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-quote)",
                        fontStyle: "italic",
                        fontSize: "1.0625rem",
                        lineHeight: 1.45,
                        color: "rgba(255,255,255,0.85)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginBottom: "20px",
                        flex: 1,
                      }}
                    >
                      {entry.quote}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {entry.author}
                      </span>
                      {entry.is_fiction && (
                        <span
                          style={{
                            display: "inline-block",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.5rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            border: "1px solid rgba(255,255,255,0.4)",
                            color: "var(--white)",
                            padding: "2px 6px",
                          }}
                        >
                          fiction
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
