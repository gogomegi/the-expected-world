import {
  getFeaturedEntry,
  getArchiveEntries,
  getClosingEntries,
  isExpired,
  timeRemaining,
  displayYear,
  getConfirmedEntries,
} from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Expected World — An archive of expired futures",
};

const COLORS = ["orange", "blue", "green", "amber"] as const;
const VIVID = {
  orange: "var(--vivid-orange)",
  blue: "var(--vivid-blue)",
  green: "var(--vivid-green)",
  amber: "var(--vivid-amber)",
};

function colorForIndex(i: number) {
  return COLORS[i % COLORS.length];
}

function extractYear(dateStr: string): string {
  return dateStr.slice(0, 4);
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export default function HomePage() {
  const featured = getFeaturedEntry();
  const archiveEntries = getArchiveEntries()
    .filter((e) => e.id !== featured.id)
    .sort(
      (a, b) =>
        b.predictedDateNormalized.localeCompare(a.predictedDateNormalized)
    )
    .slice(0, 9);
  const closingEntries = getClosingEntries().slice(0, 4);
  const totalConfirmed = getConfirmedEntries().length;

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section
        className="grid-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "160px 48px 120px",
          background: "var(--black)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div>
            <span className="section-label" style={{ marginBottom: "24px", display: "block" }}>
              An archive of expired futures
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.75rem, 5vw, 5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "var(--text-on-dark)",
                marginBottom: "32px",
              }}
            >
              The Expected World
            </h1>
            <p
              style={{
                fontFamily: "var(--font-quote)",
                fontStyle: "italic",
                fontSize: "1.25rem",
                color: "var(--muted-dark)",
                maxWidth: "400px",
                lineHeight: 1.5,
              }}
            >
              An archive of expired futures — and a watch on the ones still
              closing.
            </p>
          </div>
          {/* Color composition block */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "4px",
              aspectRatio: "1",
              maxWidth: "480px",
              justifySelf: "end",
            }}
          >
            {archiveEntries.slice(0, 4).map((entry, i) => {
              const bg = [
                "var(--vivid-orange)",
                "var(--vivid-blue)",
                "var(--vivid-green)",
                "var(--black)",
              ][i];
              const border =
                i === 3
                  ? { border: "1px solid var(--rule-dark)" }
                  : {};
              return (
                <Link key={entry.id} href={`/entry/${entry.id}`}>
                  <div
                    style={{
                      background: bg,
                      ...border,
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      aspectRatio: "1",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5625rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "6px",
                      }}
                    >
                      {isExpired(entry.predictedDateNormalized)
                        ? "expires"
                        : "closing"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "2.5rem",
                        fontWeight: 900,
                        color: "var(--white)",
                        lineHeight: 1,
                      }}
                    >
                      {extractYear(entry.predictedDateNormalized)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ENTRY ═══ */}
      <section
        className="grid-bg"
        style={{ padding: "0 48px 120px", background: "var(--black)" }}
      >
        <Link href={`/entry/${featured.id}`} style={{ display: "block" }}>
          <div
            style={{
              maxWidth: "var(--max-width)",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
            }}
          >
            {/* Left: EXPIRES color block */}
            <div
              style={{
                background: "var(--vivid-orange)",
                padding: "64px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span className="section-label" style={{ color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                {isExpired(featured.predictedDateNormalized)
                  ? "expires"
                  : "closing"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(4rem, 8vw, 7rem)",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  color: "var(--white)",
                  letterSpacing: "-0.02em",
                  marginBottom: "24px",
                }}
              >
                {displayYear(featured)}
              </span>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <span>Written {extractYear(featured.dateWritten)}</span>
                <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 8px" }}>/</span>
                <span>{featured.category}</span>
              </div>
              {featured.is_fiction && (
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255,255,255,0.4)",
                    padding: "4px 10px",
                    marginTop: "20px",
                    color: "var(--white)",
                    width: "fit-content",
                  }}
                >
                  fiction
                </span>
              )}
            </div>
            {/* Right: passage on dark */}
            <div
              style={{
                background: "#0A0A0A",
                padding: "64px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-quote)",
                  fontStyle: "italic",
                  fontSize: "1.75rem",
                  lineHeight: 1.4,
                  color: "var(--text-on-dark)",
                  marginBottom: "32px",
                }}
              >
                {truncate(featured.quote, 300)}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--text-on-dark)",
                  marginBottom: "6px",
                }}
              >
                {featured.author}
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
                {featured.source.split(",")[0]},{" "}
                {extractYear(featured.dateWritten)}
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* ═══ GATE IS CLOSING ═══ */}
      {closingEntries.length > 0 && (
        <section
          className="grid-bg"
          style={{ padding: "120px 48px", background: "var(--black)" }}
        >
          <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "48px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "2rem",
                  color: "var(--text-on-dark)",
                }}
              >
                Gate is Closing
              </h2>
              <Link
                href="/closing"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.06em",
                  color: "var(--muted-dark)",
                }}
              >
                View all →
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "4px",
              }}
            >
              {closingEntries.slice(0, 2).map((entry, i) => {
                const bg = i === 0 ? "var(--vivid-amber)" : "var(--vivid-green)";
                return (
                  <Link key={entry.id} href={`/entry/${entry.id}`}>
                    <div
                      style={{
                        background: bg,
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                      }}
                    >
                      <span className="section-label" style={{ color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>
                        closing · {timeRemaining(entry.predictedDateNormalized)}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "3.5rem",
                          fontWeight: 900,
                          color: "var(--white)",
                          lineHeight: 1,
                          marginBottom: "20px",
                        }}
                      >
                        {extractYear(entry.predictedDateNormalized)}
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
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ARCHIVE — cream section ═══ */}
      <section
        style={{
          padding: "120px 48px",
          background: "var(--cream)",
          color: "var(--text-on-light)",
        }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "48px",
              paddingBottom: "24px",
              borderBottom: "2px solid var(--text-on-light)",
            }}
          >
            <h2
              className="section-title"
              style={{
                fontSize: "2.5rem",
                color: "var(--text-on-light)",
              }}
            >
              The Archive
            </h2>
            <Link
              href="/timeline"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.06em",
                color: "var(--muted-light)",
              }}
            >
              {totalConfirmed} entries · View all →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4px",
            }}
          >
            {archiveEntries.map((entry, i) => {
              const accent = ["accent-orange", "", "accent-blue", "", "accent-green", "", "", "", ""][i] || "";
              return (
                <Link key={entry.id} href={`/entry/${entry.id}`}>
                  <div
                    className={`card-light ${accent}`}
                  >
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
                          {isExpired(entry.predictedDateNormalized) ? "expires" : "closing"}
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
                          {extractYear(entry.predictedDateNormalized)}
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
        </div>
      </section>
    </div>
  );
}
