import {
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
import MarqueeTicker from "@/components/MarqueeTicker";
import CountdownTimer from "@/components/CountdownTimer";
import HeroVideo from "@/components/HeroVideo";
import ScrollToTop from "@/components/ScrollToTop";
import MiniArchiveBrowser from "@/components/MiniArchiveBrowser";

export const metadata: Metadata = {
  title: "The Expected World — An archive of expired futures",
  description:
    "A curated archive of predictions, prophecies, and forecasts — tracking when the future was supposed to arrive.",
};

const COLORS = ["orange", "blue", "green", "amber"] as const;

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export default function HomePage() {
  const archiveEntries = getArchiveEntries()
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

  // Pick first closing entry for featured display
  const closingFeat = closingEntries[0];
  const closingYearStr = closingFeat ? displayYear(closingFeat) : "";

  // Put Fourier 1818 first, then the rest
  const fourierIdx = archiveEntries.findIndex(e => e.id === "charles-fourier-1808-lovable");
  if (fourierIdx > 0) {
    const [fourier] = archiveEntries.splice(fourierIdx, 1);
    archiveEntries.unshift(fourier);
  }

  // Serialize archive entries for client component
  const archiveForBrowser = archiveEntries.map(e => ({
    id: e.id,
    quote: e.quote,
    author: e.author,
    predictedDateNormalized: e.predictedDateNormalized,
    category: e.category,
    is_fiction: e.is_fiction,
  }));

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

      {/* ── ARCHIVE BROWSER + ABOUT TEXT ── */}
      <section style={{ background: "var(--cream)", padding: "80px 48px" }}>
        <div className="hp-browse-grid">

          {/* LEFT: Mini archive with era slider */}
          <div className="phone-frame-outer">
            <div className="phone-frame-inner">
              <p style={labelStyle}>Archive</p>
              <MiniArchiveBrowser entries={archiveForBrowser} />
            </div>
          </div>

          {/* RIGHT: About text */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "0 8px" }}>
              <h2 style={sectionHeadStyle}>What This Is</h2>
              <p style={bodyStyle}>
                An archival publication that surfaces texts originally written about
                the future — predictions, forecasts, policy projections, fictional
                imaginings — each anchored to a specific date or period that has now
                elapsed.
              </p>
              <p style={bodyStyle}>
                The site exists to create a particular kind of encounter: a reader
                meets a mind from the past speaking confidently, or anxiously, or
                hopefully, about a moment the reader has already lived through. The
                gap between expectation and outcome is the editorial territory.
              </p>
              <h2 style={sectionHeadStyle}>How Entries Are Selected</h2>
              <p style={bodyStyle}>
                Every entry must satisfy four criteria. The source text must
                reference a specific future date, year, or bounded period. The
                source must be verifiable. And the pairing of prediction and elapsed
                reality must reward attention.
              </p>
              <hr style={hrStyle} />
              <h2 style={sectionHeadStyle}>Contact & Submissions</h2>
              <p style={bodyStyle}>
                If you have found a passage that meets our criteria, we would like
                to hear about it.{" "}
                <Link
                  href="/submit"
                  style={{
                    color: "var(--orange)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Submit a passage
                </Link>
                .
              </p>
              <p style={{ ...bodyStyle, marginBottom: 0 }}>
                For other inquiries:{" "}
                <a
                  href="mailto:contact@theexpectedworld.com"
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: "0.75rem",
                    color: "var(--orange)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  contact@theexpectedworld.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── MARQUEE TICKER (separator) ── */}
      <MarqueeTicker items={tickerItemsDoubled} />

      {/* ── FEATURED CLOSING (old dark featured style) ── */}
      {closingFeat && (
        <section
          style={{ padding: "80px 48px 64px", background: "var(--black)" }}
        >
          <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
            <Link href={`/entry/${closingFeat.id}`} style={{ display: "block" }}>
              <div className="hp-feat-grid">
                {/* LEFT: Closing panel */}
                <div className="feat-exp">
                  <span className="section-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                    GATE IS CLOSING
                  </span>
                  <div style={{ marginTop: 8 }}>
                    <CounterYear year={parseInt(closingYearStr) || 0} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <CountdownTimer targetDate={closingFeat.predictedDateNormalized} />
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
                    <div>WRITTEN: {closingFeat.dateWritten}</div>
                    <div>ADDRESSED TO: {closingFeat.predictedDate}</div>
                  </div>
                  {closingFeat.is_fiction && (
                    <span className="fiction-badge" style={{ marginTop: 12, marginLeft: 0 }}>FICTION</span>
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
                      margin: 0, padding: 0, border: "none",
                    }}
                  >
                    &ldquo;{closingFeat.quote.length > 350 ? truncate(closingFeat.quote, 350) : closingFeat.quote}&rdquo;
                  </blockquote>
                  <p style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-d)", marginTop: 24 }}>
                    {closingFeat.author}
                  </p>
                  <p style={{ fontFamily: "var(--fm)", fontSize: "0.6875rem", letterSpacing: "0.04em", color: "var(--muted-d)", marginTop: 4 }}>
                    {closingFeat.source}
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
                  padding: "32px 48px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 32,
                }}
              >
                <p style={{ fontFamily: "var(--fq)", fontSize: "0.9375rem", fontStyle: "italic", lineHeight: 1.65, color: "var(--muted-d)", margin: 0, flex: 1 }}>
                  {closingFeat.annotation}
                </p>
              </div>
            </Link>
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <Link
                href="/closing"
                style={{
                  fontFamily: "var(--fm)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted-d)",
                }}
              >
                View more →
              </Link>
            </div>
          </div>
        </section>
      )}

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
  marginBottom: 16,
};

const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "var(--fh)",
  fontSize: "0.6875rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--text-l)",
  marginBottom: "14px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--fh)",
  fontSize: "0.8125rem",
  lineHeight: 1.7,
  color: "var(--text-l)",
  marginBottom: "16px",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid var(--rule-l)",
  margin: "28px 0",
};
