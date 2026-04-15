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
import MouseTrail from "@/components/MouseTrail";
import BottomBar from "@/components/BottomBar";
import PaintCanvas from "@/components/PaintCanvas";
import MagicCube from "@/components/MagicCube";
import CounterYear from "@/components/CounterYear";
import ScrollReveal from "@/components/ScrollReveal";
import MarqueeTicker from "@/components/MarqueeTicker";
import CountdownTimer from "@/components/CountdownTimer";

export const metadata: Metadata = {
  title: "The Expected World — An archive of expired futures",
  description:
    "A curated archive of predictions, prophecies, and forecasts — tracking when the future was supposed to arrive.",
};

const COLORS = ["orange", "blue", "green", "amber"] as const;
const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

function colorIndex(i: number) {
  return i % COLORS.length;
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export default function HomePage() {
  const featured = getFeaturedEntry();
  const archiveEntries = getArchiveEntries()
    .filter((e) => e.id !== featured.id)
    .sort((a, b) => b.predictedDateNormalized.localeCompare(a.predictedDateNormalized));
  const closingEntries = getClosingEntries().slice(0, 4);
  const confirmed = getConfirmedEntries();
  const archiveCount = getArchiveEntries().length;

  // Cube years — spread across eras for variety
  const cubeYearPicks: typeof archiveEntries = [];
  const seenDecades = new Set<string>();
  // Walk all entries sorted by predicted date, pick one per decade spread
  const sorted = [...archiveEntries].sort((a, b) =>
    a.predictedDateNormalized.localeCompare(b.predictedDateNormalized)
  );
  for (const e of sorted) {
    if (cubeYearPicks.length >= 6) break;
    const yr = parseInt(e.predictedDateNormalized.slice(0, 4));
    const decade = `${Math.floor(yr / 50) * 50}`;
    if (!seenDecades.has(decade)) {
      seenDecades.add(decade);
      cubeYearPicks.push(e);
    }
  }
  // Fill remaining slots if needed
  for (const e of sorted) {
    if (cubeYearPicks.length >= 6) break;
    if (!cubeYearPicks.includes(e)) cubeYearPicks.push(e);
  }
  const cubeYears = cubeYearPicks.map((e) => ({
    year: displayYear(e),
    label: isExpired(e.predictedDateNormalized) ? "Expires" : "Closing",
  }));

  // Ticker items from confirmed entries
  const tickerSource = confirmed.slice(0, 12);
  const tickerItems = tickerSource.map((e, i) => ({
    year: displayYear(e),
    label: `${isExpired(e.predictedDateNormalized) ? "Expires" : "Closing"} ${displayYear(e)}`,
    excerpt: truncate(e.quote, 80),
    colorClass: COLORS[i % COLORS.length],
  }));
  // Duplicate for seamless loop
  const tickerItemsDoubled = [...tickerItems, ...tickerItems];

  const displayArchive = archiveEntries.slice(0, 18);

  return (
    <div>
      <MouseTrail />
      <BottomBar closedCount={archiveCount} />

      {/* ── HERO ── */}
      <section
        className="grid-bg"
        style={{
          minHeight: "100vh",
          padding: "160px 48px 120px",
          background: "var(--black)",
          position: "relative",
        }}
      >
        <PaintCanvas />
        <div className="hp-hero-grid">
          {/* LEFT */}
          <div>
            <ScrollReveal delay={0}>
              <span className="section-label">Archive of Expired Futures</span>
              <h1
                style={{
                  fontFamily: "var(--fh)",
                  fontSize: "clamp(2.75rem, 5vw, 5rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.95,
                  color: "var(--text-d)",
                  marginTop: 12,
                }}
              >
                The Expected World
              </h1>
            </ScrollReveal>
          </div>
          {/* RIGHT */}
          <div>
            <MagicCube years={cubeYears} />
          </div>
        </div>
      </section>

      {/* ── FEATURED ENTRY ── */}
      <section
        className="grid-bg"
        style={{
          padding: "0 48px 120px",
          background: "var(--black)",
        }}
      >
        <ScrollReveal delay={0}>
          <Link href={`/entry/${featured.id}`} style={{ display: "block" }}>
            <div className="hp-feat-grid">
              {/* LEFT: Expires panel */}
              <div className="feat-exp">
                <span
                  className="section-label"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {isExpired(featured.predictedDateNormalized) ? "EXPIRES" : "CLOSING"}
                </span>
                <div style={{ marginTop: 8 }}>
                  <CounterYear year={parseInt(displayYear(featured))} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 16,
                    lineHeight: 1.8,
                  }}
                >
                  <div>WRITTEN: {featured.dateWritten}</div>
                  <div>ADDRESSED TO: {featured.predictedDate}</div>
                </div>
                {featured.is_fiction && (
                  <span className="fiction-badge" style={{ marginTop: 12, marginLeft: 0 }}>
                    FICTION
                  </span>
                )}
              </div>
              {/* RIGHT: Quote panel */}
              <div
                className="hp-feat-quote"
                style={{
                  background: "#0A0A0A",
                  padding: "64px 48px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <blockquote
                  style={{
                    fontFamily: "var(--fq)",
                    fontSize: "1.75rem",
                    fontStyle: "italic",
                    lineHeight: 1.45,
                    color: "var(--text-d)",
                    margin: 0,
                    padding: 0,
                    border: "none",
                  }}
                >
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
                <p
                  style={{
                    fontFamily: "var(--fh)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "var(--text-d)",
                    marginTop: 24,
                  }}
                >
                  {featured.author}
                </p>
                <p
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.04em",
                    color: "var(--muted-d)",
                    marginTop: 4,
                  }}
                >
                  {featured.source}
                </p>
              </div>
            </div>
            {/* Annotation bar */}
            <div
              className="hp-annotation"
              style={{
                background: "#111",
                maxWidth: "var(--max-width)",
                margin: "4px auto 0",
                padding: "40px 48px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--fq)",
                  fontSize: "0.9375rem",
                  fontStyle: "italic",
                  lineHeight: 1.65,
                  color: "var(--muted-d)",
                }}
              >
                {featured.annotation}
              </p>
            </div>
          </Link>
        </ScrollReveal>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <MarqueeTicker items={tickerItemsDoubled} />

      {/* ── GATE IS CLOSING ── */}
      {closingEntries.length > 0 && (
        <section
          className="grid-bg"
          style={{
            padding: "120px 48px",
            background: "var(--black)",
          }}
        >
          <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 40,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--fh)",
                  fontWeight: 800,
                  fontSize: "2rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "var(--text-d)",
                }}
              >
                The Gate is Closing
              </h2>
              <Link
                href="/closing"
                style={{
                  fontFamily: "var(--fm)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--muted-d)",
                }}
              >
                View all →
              </Link>
            </div>
            <div className="hp-gate-grid">
              {closingEntries.map((entry, i) => {
                const cardColor = i % 2 === 0 ? "--amber" : "--green";
                const cardClass = i % 2 === 0 ? "gate-card gate-card--amber" : "gate-card gate-card--green";
                return (
                  <Link key={entry.id} href={`/entry/${entry.id}`}>
                    <div className={cardClass}>
                      <span className="section-label" style={{ color: "rgba(255,255,255,0.6)" }}>
                        closing
                      </span>
                      <div style={{ marginTop: 8 }}>
                        <CounterYear year={parseInt(displayYear(entry))} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <CountdownTimer targetDate={entry.predictedDateNormalized} />
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--fq)",
                          fontStyle: "italic",
                          fontSize: "1rem",
                          lineHeight: 1.5,
                          color: "rgba(255,255,255,0.85)",
                          marginTop: 20,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flex: 1,
                        }}
                      >
                        &ldquo;{entry.quote}&rdquo;
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--fh)",
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          color: "rgba(255,255,255,0.7)",
                          marginTop: 16,
                        }}
                      >
                        {entry.author}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ARCHIVE (LIGHT BG) ── */}
      <section
        style={{
          padding: "120px 48px",
          background: "var(--cream)",
        }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--fh)",
                fontWeight: 900,
                fontSize: "2.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color: "var(--text-l)",
                lineHeight: 1,
              }}
            >
              From the Archive
            </h2>
            <Link
              href="/timeline"
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--muted-l)",
              }}
            >
              {archiveCount} entries →
            </Link>
          </div>
          <div className="hp-archive-grid">
            {displayArchive.map((entry, i) => {
              const ci = colorIndex(i);
              const hoverBg = COLOR_VARS[ci];
              const yearStr = displayYear(entry);
              return (
                <Link key={entry.id} href={`/entry/${entry.id}`}>
                  <div className="ac-light">
                    <div
                      className="ac-hover-bg"
                      style={{ background: hoverBg }}
                    />
                    <span className="ac-ghost">{yearStr}</span>
                    {/* Top row */}
                    <div
                      className="ac-top"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
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
                        {isExpired(entry.predictedDateNormalized) ? "expires" : "closing"}
                      </span>
                      <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
                        <CounterYear year={parseInt(yearStr) || 0} />
                      </span>
                      {entry.is_fiction && <span className="fiction-badge">FICTION</span>}
                    </div>
                    {/* Quote */}
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
                    {/* Bottom */}
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
          <div className="view-all">
            <Link href="/timeline">View all entries →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
