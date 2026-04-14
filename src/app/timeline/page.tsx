import { getEntriesByDecade, getConfirmedEntries } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "All entries in The Expected World arranged by the date they predicted.",
  alternates: { canonical: "/timeline" },
};

const STRIPES = ["stripe-orange", "stripe-blue", "stripe-green", "stripe-amber"] as const;

function stripeForIndex(i: number) {
  return STRIPES[i % STRIPES.length];
}

export default function TimelinePage() {
  const byDecade = getEntriesByDecade();
  const total = getConfirmedEntries().length;
  const decades = Object.keys(byDecade);

  let globalIndex = 0;

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
          Timeline
        </h1>
        <p
          style={{
            fontFamily: "var(--font-quote)",
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "var(--muted-dark)",
            maxWidth: "480px",
            margin: "0 auto 48px",
            lineHeight: 1.5,
          }}
        >
          {total} entries arranged by the date they predicted.
        </p>

        {/* Decade nav pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            maxWidth: "var(--max-width)",
            margin: "0 auto",
          }}
        >
          {decades.map((decade) => (
            <a
              key={decade}
              href={`#${decade}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: "var(--text-on-dark)",
                background: "rgba(255,255,255,0.08)",
                padding: "6px 16px",
                textDecoration: "none",
                transition: "background 0.25s",
              }}
            >
              {decade}
            </a>
          ))}
        </div>
      </section>

      {/* ═══ ENTRIES BY DECADE ═══ */}
      <section
        className="grid-bg"
        style={{
          background: "var(--black)",
          padding: "80px 48px 120px",
        }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {decades.map((decade) => {
            const decadeEntries = byDecade[decade];
            return (
              <div key={decade} id={decade} style={{ marginBottom: "80px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "16px",
                    marginBottom: "32px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--rule-dark)",
                  }}
                >
                  <h2
                    className="section-title"
                    style={{
                      fontSize: "1.75rem",
                      color: "var(--text-on-dark)",
                      margin: 0,
                    }}
                  >
                    {decade}
                  </h2>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6875rem",
                      letterSpacing: "0.04em",
                      color: "var(--muted-dark)",
                    }}
                  >
                    {decadeEntries.length} entries
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "4px",
                  }}
                >
                  {decadeEntries.map((entry) => {
                    const stripe = stripeForIndex(globalIndex);
                    globalIndex++;
                    return (
                      <Link
                        key={entry.id}
                        href={`/entry/${entry.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className={`card-dark ${stripe}`}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "space-between",
                              marginBottom: "20px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "1.75rem",
                                fontWeight: 900,
                                color: "var(--text-on-dark)",
                                lineHeight: 1,
                              }}
                            >
                              {entry.predictedDateNormalized.slice(0, 4)}
                            </span>
                            {entry.is_fiction && (
                              <span className="fiction-badge">fiction</span>
                            )}
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--font-quote)",
                              fontStyle: "italic",
                              fontSize: "1rem",
                              lineHeight: 1.45,
                              color: "var(--text-on-dark)",
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
                              borderTop: "1px solid var(--rule-dark)",
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
                                color: "var(--text-on-dark)",
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
                                color: "var(--muted-dark)",
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
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
