import { getFeaturedEntry, getArchiveEntries, getClosingEntries, isExpired, timeRemaining } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Expected World — An archive of expired futures",
};

function extractYear(dateStr: string): string {
  return dateStr.slice(0, 4);
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function FictionBadge() {
  return (
    <span
      style={{
        fontFamily: "var(--font-chrome)",
        fontSize: "0.5625rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
        color: "var(--color-secondary)",
        border: "1px solid rgba(120, 113, 103, 0.3)",
        padding: "1px 6px",
        borderRadius: "1px",
        marginLeft: "8px",
        verticalAlign: "middle",
        position: "relative" as const,
        top: "-1px",
      }}
    >
      FICTION
    </span>
  );
}

export default function HomePage() {
  const featured = getFeaturedEntry();
  const archiveEntries = getArchiveEntries()
    .filter((e) => e.id !== featured.id)
    .sort((a, b) => b.predictedDateNormalized.localeCompare(a.predictedDateNormalized))
    .slice(0, 10);
  const closingEntries = getClosingEntries().slice(0, 6);

  return (
    <div>
      {/* Zone 1: Title Section */}
      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-7)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 6vw, var(--text-masthead))",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          The Expected World
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--color-secondary)",
            marginTop: "var(--space-2)",
            marginBottom: 0,
          }}
        >
          An archive of expired futures — and a watch on the ones still closing.
        </p>
      </section>

      {/* Zone 2: Featured Entry */}
      <section
        style={{
          maxWidth: "var(--max-width-layout)",
          margin: "0 auto",
          padding: "0 var(--space-6) var(--space-6)",
        }}
      >
        <Link href={`/entry/${featured.id}`} style={{ display: "block" }}>
          <div
            style={{
              paddingTop: "var(--space-7)",
              paddingBottom: "var(--space-6)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-chrome)",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontWeight: 500,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                color: "var(--color-accent)",
                margin: 0,
              }}
            >
              {isExpired(featured.predictedDateNormalized) ? "EXPIRES" : "CLOSING"}:{" "}
              {extractYear(featured.predictedDateNormalized)}
            </p>
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
              WRITTEN: {extractYear(featured.dateWritten)}
            </p>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, var(--text-quote))",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.4,
                color: "var(--color-text)",
                maxWidth: "var(--max-width-prose)",
                margin: 0,
                marginBottom: "var(--space-4)",
                padding: 0,
                border: "none",
              }}
            >
              {featured.quote}
            </blockquote>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                letterSpacing: "0.04em",
                color: "var(--color-secondary)",
                margin: 0,
              }}
            >
              {featured.author} · {featured.source.split(",")[0]}
              {featured.dateWritten ? `, ${extractYear(featured.dateWritten)}` : ""}
              {featured.is_fiction && <FictionBadge />}
            </p>
          </div>
        </Link>
      </section>

      {/* Zone 3: Archive Ledger */}
      <section
        style={{
          maxWidth: "var(--max-width-layout)",
          margin: "0 auto",
          padding: "0 var(--space-6) var(--space-7)",
        }}
      >
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(120, 113, 103, 0.2)",
            marginBottom: "var(--space-4)",
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
            marginBottom: "var(--space-4)",
          }}
        >
          From the Archive
        </p>
        <div>
          {archiveEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/entry/${entry.id}`}
              style={{ display: "block", textDecoration: "none" }}
            >
              <div className="ledger-row">
                <span
                  style={{
                    fontFamily: "var(--font-chrome)",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--color-accent)",
                  }}
                >
                  {extractYear(entry.predictedDateNormalized)}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    color: "var(--color-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncate(entry.quote, 90)}
                  {entry.is_fiction && <FictionBadge />}
                </span>
                <span
                  className="ledger-meta"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    letterSpacing: "0.04em",
                    color: "var(--color-secondary)",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.author.split(" ").slice(-1)[0]},{" "}
                  {extractYear(entry.dateWritten)}
                </span>
                <span
                  className="ledger-category"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    letterSpacing: "0.04em",
                    color: "var(--color-secondary)",
                    textAlign: "right",
                  }}
                >
                  {entry.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ paddingTop: "var(--space-3)" }}>
          <Link
            href="/timeline"
            style={{
              fontFamily: "var(--font-chrome)",
              fontSize: "var(--text-ui)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--color-accent)",
            }}
          >
            view all expired →
          </Link>
        </div>
      </section>

      {/* Zone 4: Gate is Closing */}
      {closingEntries.length > 0 && (
        <section
          style={{
            maxWidth: "var(--max-width-layout)",
            margin: "0 auto",
            padding: "0 var(--space-6) var(--space-7)",
          }}
        >
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(120, 113, 103, 0.2)",
              marginBottom: "var(--space-4)",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-chrome)",
              fontSize: "var(--text-ui)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              marginBottom: "var(--space-4)",
            }}
          >
            Gate is Closing
          </p>
          <div>
            {closingEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div className="ledger-row">
                  <span
                    style={{
                      fontFamily: "var(--font-chrome)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                    }}
                  >
                    {extractYear(entry.predictedDateNormalized)}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      color: "var(--color-text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {truncate(entry.quote, 80)}
                    {entry.is_fiction && <FictionBadge />}
                  </span>
                  <span
                    className="ledger-meta"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      letterSpacing: "0.04em",
                      color: "var(--color-accent)",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {timeRemaining(entry.predictedDateNormalized)}
                  </span>
                  <span
                    className="ledger-category"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      letterSpacing: "0.04em",
                      color: "var(--color-secondary)",
                      textAlign: "right",
                    }}
                  >
                    {entry.author.split(" ").slice(-1)[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ paddingTop: "var(--space-3)" }}>
            <Link
              href="/closing"
              style={{
                fontFamily: "var(--font-chrome)",
                fontSize: "var(--text-ui)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "var(--color-accent)",
              }}
            >
              view all closing →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
