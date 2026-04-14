import { getEntriesByDecade, getConfirmedEntries } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "All entries in The Expected World arranged by the date they predicted.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  const byDecade = getEntriesByDecade();
  const total = getConfirmedEntries().length;
  const decades = Object.keys(byDecade);

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
          Timeline
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--color-secondary)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-6)",
          }}
        >
          {total} entries arranged by the date they predicted.
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

      <div
        style={{
          maxWidth: "var(--max-width-layout)",
          margin: "0 auto",
          padding: "0 var(--space-6) var(--space-7)",
        }}
      >
        {/* Decade nav */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            marginBottom: "var(--space-5)",
            borderBottom: "1px solid rgba(120, 113, 103, 0.2)",
            paddingBottom: "var(--space-3)",
          }}
        >
          {decades.map((decade) => (
            <a
              key={decade}
              href={`#${decade}`}
              style={{
                fontFamily: "var(--font-chrome)",
                fontSize: "var(--text-ui)",
                fontWeight: 500,
                color: "var(--color-secondary)",
                letterSpacing: "0.06em",
              }}
            >
              {decade}
            </a>
          ))}
        </div>

        {/* Entries by decade */}
        {decades.map((decade) => (
          <section key={decade} id={decade} style={{ marginBottom: "var(--space-6)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "var(--space-2)",
                marginBottom: "var(--space-3)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-chrome)",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                {decade}
              </h2>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  color: "var(--color-secondary)",
                }}
              >
                {byDecade[decade].length} entries
              </span>
              <div
                style={{
                  flex: 1,
                  borderTop: "1px solid rgba(120, 113, 103, 0.15)",
                }}
              />
            </div>

            {byDecade[decade].map((entry) => (
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
                    {entry.predictedDateNormalized.slice(0, 4)}
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
                    {entry.quote.length > 90
                      ? entry.quote.slice(0, 90) + "…"
                      : entry.quote}
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
                    {entry.dateWritten.slice(0, 4)}
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
          </section>
        ))}
      </div>
    </div>
  );
}
