import { getClosingEntries, timeRemaining, displayYear } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gate is Closing",
  description: "Predictions addressed to dates that have not yet arrived.",
};

function extractYear(dateStr: string): string {
  return dateStr.slice(0, 4);
}

export default function ClosingPage() {
  const entries = getClosingEntries();

  return (
    <div>
      {/* Title section */}
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
            fontSize: "clamp(2.5rem, 5vw, var(--text-masthead))",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Gate is Closing
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            fontStyle: "italic",
            color: "var(--color-secondary)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-6)",
          }}
        >
          Predictions addressed to dates that have not yet arrived.
        </p>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(120, 113, 103, 0.4)",
            maxWidth: "var(--max-width-layout)",
            margin: "0 auto",
          }}
        />
      </section>

      {/* Entry list */}
      <section
        style={{
          maxWidth: "var(--max-width-layout)",
          margin: "0 auto",
          padding: "0 var(--space-6) var(--space-7)",
        }}
      >
        {entries.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              color: "var(--color-secondary)",
            }}
          >
            No predictions with future dates in the confirmed corpus yet.
          </p>
        ) : (
          <div>
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "var(--space-4) 0",
                    borderBottom: "1px solid rgba(120, 113, 103, 0.15)",
                  }}
                >
                  {/* CLOSING date + time remaining */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-chrome)",
                        fontSize: "1.5rem",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        color: "var(--color-accent)",
                        margin: 0,
                      }}
                    >
                      CLOSING: {displayYear(entry)}
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--font-chrome)",
                        fontSize: "var(--text-ui)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "var(--color-accent)",
                        opacity: 0.7,
                      }}
                    >
                      {timeRemaining(entry.predictedDateNormalized)}
                    </span>
                  </div>

                  {/* Quote excerpt */}
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 300,
                      fontStyle: "italic",
                      lineHeight: 1.4,
                      color: "var(--color-text)",
                      margin: 0,
                      marginBottom: "var(--space-1)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {entry.quote}
                  </p>

                  {/* Attribution */}
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      letterSpacing: "0.04em",
                      color: "var(--color-secondary)",
                      margin: 0,
                    }}
                  >
                    {entry.author} · {entry.source.split(",")[0]}, {extractYear(entry.dateWritten)}
                    {entry.is_fiction && (
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
                        }}
                      >
                        FICTION
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
