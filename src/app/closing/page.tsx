import { getClosingEntries, displayYear } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";
import CounterYear from "@/components/CounterYear";
import CountdownTimer from "@/components/CountdownTimer";

export const metadata: Metadata = {
  title: "Gate is Closing",
  description: "Predictions addressed to dates that have not yet arrived.",
  alternates: { canonical: "/closing" },
};

const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

export default function ClosingPage() {
  const entries = getClosingEntries();

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <section style={{ padding: "120px 48px 80px" }}>
        <div className="phone-frame-outer">
        <div className="phone-frame-inner">
          <p style={pageLabelStyle}>Closing</p>
          <p
            style={{
              fontFamily: "var(--fq)",
              fontStyle: "italic",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: "var(--text-l)",
              opacity: 0.5,
              marginBottom: "32px",
            }}
          >
            Predictions addressed to dates that have not yet arrived. The clock is still running.
          </p>

          {entries.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--fq)",
                fontStyle: "italic",
                fontSize: "0.875rem",
                color: "var(--muted-l)",
                textAlign: "center",
              }}
            >
              No predictions with future dates in the confirmed corpus yet.
            </p>
          ) : (
            <div className="closing-grid">
              {entries.map((entry, i) => {
                const yearStr = displayYear(entry);
                const hoverBg = COLOR_VARS[i % COLOR_VARS.length];
                return (
                  <Link
                    key={entry.id}
                    href={`/entry/${entry.id}`}
                    style={{ display: "block", textDecoration: "none" }}
                  >
                    <div className="ac-light">
                      <div
                        className="ac-hover-bg"
                        style={{ background: hoverBg }}
                      />
                      <span className="ac-ghost">{yearStr}</span>
                      <div
                        className="ac-top"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
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
                          closing
                        </span>
                        <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
                          <CounterYear year={parseInt(yearStr) || 0} />
                        </span>
                        {entry.is_fiction && <span className="fiction-badge">FICTION</span>}
                      </div>
                      <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
                        <CountdownTimer targetDate={entry.predictedDateNormalized} />
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
                        &ldquo;{entry.quote}&rdquo;
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
                          {entry.author}
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
        </div>
      </section>
    </div>
  );
}

const pageLabelStyle: React.CSSProperties = {
  fontFamily: "var(--fm)",
  fontSize: "0.5625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted-l)",
  marginBottom: "32px",
};
