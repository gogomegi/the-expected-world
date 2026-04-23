import {
  getFeaturedEntry,
  getArchiveEntries,
  getClosingEntries,
  isExpired,
  displayYear,
  getConfirmedEntries,
} from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";
import BottomBar from "@/components/BottomBar";
import CounterYear from "@/components/CounterYear";
import ScrollReveal from "@/components/ScrollReveal";
import MarqueeTicker from "@/components/MarqueeTicker";
import CountdownTimer from "@/components/CountdownTimer";
import HeroVideo from "@/components/HeroVideo";
import ScrollToTop from "@/components/ScrollToTop";

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
  const closingEntries = getClosingEntries();
  const confirmed = getConfirmedEntries();
  const archiveCount = getArchiveEntries().length;

  const tickerSource = confirmed.slice(0, 12);
  const tickerItems = tickerSource.map((e, i) => ({
    year: displayYear(e),
    label: `${isExpired(e.predictedDateNormalized) ? "Expires" : "Closing"} ${displayYear(e)}`,
    excerpt: truncate(e.quote, 80),
    colorClass: COLORS[i % COLORS.length],
  }));
  const tickerItemsDoubled = [...tickerItems, ...tickerItems];

  const previewArchive = archiveEntries.slice(0, 3);

  return (
    <div>
      <ScrollToTop />
      <BottomBar closedCount={archiveCount} />

      {/* ── HERO ── */}
      <section className="hero-phello">
        <div className="hero-phello-outer">
          <div className="hero-phello-inner">
            <div className="hero-video-container">
              <HeroVideo />
              <div className="hero-title-overlay">
                <span className="section-label" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Archive of Expired Futures
                </span>
                <h1
                  style={{
                    fontFamily: "var(--fh)",
                    fontSize: "clamp(2.5rem, 5vw, 5rem)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.95,
                    color: "var(--text-d)",
                    marginTop: 10,
                  }}
                >
                  The Expected World
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED ENTRY ── */}
      <section
        className="grid-bg"
        style={{ padding: "0 48px 120px", background: "var(--black)" }}
      >
        <ScrollReveal delay={0}>
          <Link href={`/entry/${featured.id}`} style={{ display: "block" }}>
            <div className="hp-feat-grid">
              <div className="feat-exp">
                <span className="section-label" style={{ color: "rgba(255,255,255,0.7)" }}>
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
                  <span className="fiction-badge" style={{ marginTop: 12, marginLeft: 0 }}>FICTION</span>
                )}
              </div>
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
                    margin: 0, padding: 0, border: "none",
                  }}
                >
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
                <p style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-d)", marginTop: 24 }}>
                  {featured.author}
                </p>
                <p style={{ fontFamily: "var(--fm)", fontSize: "0.6875rem", letterSpacing: "0.04em", color: "var(--muted-d)", marginTop: 4 }}>
                  {featured.source}
                </p>
              </div>
            </div>
            <div className="hp-annotation" style={{ background: "#111", maxWidth: "var(--max-width)", margin: "4px auto 0", padding: "40px 48px" }}>
              <p style={{ fontFamily: "var(--fq)", fontSize: "0.9375rem", fontStyle: "italic", lineHeight: 1.65, color: "var(--muted-d)" }}>
                {featured.annotation}
              </p>
            </div>
          </Link>
        </ScrollReveal>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <MarqueeTicker items={tickerItemsDoubled} />

      {/* ── ARCHIVE + CLOSING SIDE BY SIDE ── */}
      <section style={{ background: "var(--cream)", padding: "80px 48px" }}>
        <div className="hp-browse-grid">

          {/* LEFT: Archive */}
          <div className="phone-frame-outer">
            <div className="phone-frame-inner">
              <p style={{ ...labelStyle, marginBottom: 24 }}>Archive</p>
              {previewArchive.map((entry, i) => {
                const yearStr = displayYear(entry);
                const hoverBg = COLOR_VARS[colorIndex(i)];
                return (
                  <Link key={entry.id} href={`/entry/${entry.id}`}>
                    <div className="ac-light" style={{ marginBottom: 4 }}>
                      <div className="ac-hover-bg" style={{ background: hoverBg }} />
                      <span className="ac-ghost">{yearStr}</span>
                      <div className="ac-top" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative", zIndex: 1 }}>
                        <span className="ac-el" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-l)" }}>
                          expires
                        </span>
                        <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
                          <CounterYear year={parseInt(yearStr) || 0} />
                        </span>
                        {entry.is_fiction && <span className="fiction-badge">FICTION</span>}
                      </div>
                      <p className="ac-excerpt" style={{ fontFamily: "var(--fq)", fontStyle: "italic", fontSize: "0.875rem", lineHeight: 1.5, color: "var(--text-l)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", position: "relative", zIndex: 1 }}>
                        &ldquo;{entry.quote}&rdquo;
                      </p>
                      <div className="ac-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, position: "relative", zIndex: 1 }}>
                        <span className="ac-auth" style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text-l)" }}>{entry.author}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Link
                  href="/timeline"
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-l)",
                    opacity: 0.5,
                  }}
                >
                  View all entries →
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Closing */}
          <div className="phone-frame-outer">
            <div className="phone-frame-inner">
              <p style={{ ...labelStyle, marginBottom: 24 }}>Closing</p>
              {closingEntries.map((entry, i) => {
                const yearStr = displayYear(entry);
                const hoverBg = COLOR_VARS[i % COLOR_VARS.length];
                return (
                  <Link key={entry.id} href={`/entry/${entry.id}`} style={{ display: "block", textDecoration: "none" }}>
                    <div className="ac-light" style={{ marginBottom: 4 }}>
                      <div className="ac-hover-bg" style={{ background: hoverBg }} />
                      <span className="ac-ghost">{yearStr}</span>
                      <div className="ac-top" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, position: "relative", zIndex: 1 }}>
                        <span className="ac-el" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-l)" }}>closing</span>
                        <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
                          <CounterYear year={parseInt(yearStr) || 0} />
                        </span>
                        {entry.is_fiction && <span className="fiction-badge">FICTION</span>}
                      </div>
                      <div style={{ marginBottom: 12, position: "relative", zIndex: 1 }}>
                        <CountdownTimer targetDate={entry.predictedDateNormalized} />
                      </div>
                      <p className="ac-excerpt" style={{ fontFamily: "var(--fq)", fontStyle: "italic", fontSize: "0.875rem", lineHeight: 1.5, color: "var(--text-l)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", position: "relative", zIndex: 1 }}>
                        &ldquo;{entry.quote}&rdquo;
                      </p>
                      <div className="ac-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, position: "relative", zIndex: 1 }}>
                        <span className="ac-auth" style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text-l)" }}>{entry.author}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Link
                  href="/closing"
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-l)",
                    opacity: 0.5,
                  }}
                >
                  View all closing →
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ── CTA SECTION ── */}
        <div
          style={{
            maxWidth: "780px",
            margin: "48px auto 0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-l)",
              lineHeight: 2.4,
            }}
          >
            CURIOUS{" "}
            <Link href="/about" style={{ color: "var(--orange)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              WHAT THIS IS
            </Link>
            ?&nbsp;&nbsp;&nbsp;WANT TO{" "}
            <Link href="/submit" style={{ color: "var(--orange)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              ADD SOMETHING
            </Link>
            ?
          </p>
        </div>

      </section>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--fm)",
  fontSize: "0.5625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted-l)",
  margin: 0,
};

