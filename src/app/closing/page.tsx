import { getClosingEntries, timeRemaining, displayYear } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";
import LazyPaintCanvas from "@/components/LazyPaintCanvas";
import ScrollReveal from "@/components/ScrollReveal";
import CounterYear from "@/components/CounterYear";
import CountdownTimer from "@/components/CountdownTimer";

export const metadata: Metadata = {
  title: "Gate is Closing",
  description: "Predictions addressed to dates that have not yet arrived.",
  alternates: { canonical: "/closing" },
};

const CARD_COLORS = ["amber", "green", "blue", "orange"] as const;

export default function ClosingPage() {
  const entries = getClosingEntries();

  return (
    <div>
      {/* Dark hero */}
      <section
        className="grid-bg"
        style={{
          padding: "180px 48px 80px",
          position: "relative",
          overflow: "hidden",
          background: "var(--black)",
          textAlign: "center",
        }}
      >
        <LazyPaintCanvas />
        <ScrollReveal delay={0}>
          <h1
            className="section-title"
            style={{ fontSize: "4rem", color: "var(--text-d)", margin: 0 }}
          >
            GATE IS CLOSING
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p
            style={{
              fontFamily: "var(--fq)",
              fontStyle: "italic",
              fontSize: "1.125rem",
              color: "var(--muted-d)",
              marginTop: "16px",
            }}
          >
            Predictions addressed to dates that have not yet arrived.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.16}>
          <p
            style={{
              fontFamily: "var(--fh)",
              fontSize: "0.875rem",
              color: "var(--muted-d)",
              maxWidth: "520px",
              margin: "16px auto 0",
              lineHeight: 1.65,
            }}
          >
            These passages speak to a future that has not yet closed. The clock is still running.
          </p>
        </ScrollReveal>
      </section>

      {/* Dark entries section */}
      <section
        style={{
          padding: "80px 48px",
          background: "var(--black)",
        }}
      >
        {entries.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--fq)",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "var(--muted-d)",
              textAlign: "center",
            }}
          >
            No predictions with future dates in the confirmed corpus yet.
          </p>
        ) : (
          <div className="closing-grid">
            {entries.map((entry, i) => {
              const colorKey = CARD_COLORS[i % 4];
              const year = parseInt(entry.predictedDateNormalized.slice(0, 4));
              return (
                <Link
                  key={entry.id}
                  href={`/entry/${entry.id}`}
                  style={{ display: "block", textDecoration: "none" }}
                >
                  <div className={`gate-card gate-card--${colorKey}`}>
                    <span
                      style={{
                        fontFamily: "var(--fm)",
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: "8px",
                      }}
                    >
                      closing
                    </span>
                    <div style={{ marginBottom: "8px" }}>
                      <CounterYear year={year} style={{ fontFamily: "var(--fh)", fontSize: "4rem", fontWeight: 900, color: "var(--white)", lineHeight: 1 }} />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <CountdownTimer targetDate={entry.predictedDateNormalized} />
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--fq)",
                        fontStyle: "italic",
                        fontSize: "0.9375rem",
                        lineHeight: 1.5,
                        color: "rgba(255,255,255,0.9)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginBottom: "16px",
                        flex: 1,
                      }}
                    >
                      {entry.quote}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--fm)",
                        fontSize: "0.6875rem",
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {entry.author} · {entry.source.split(",")[0]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
