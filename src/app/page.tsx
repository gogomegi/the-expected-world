import { getArchiveEntries } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";
import BottomBar from "@/components/BottomBar";
import HeroVideo from "@/components/HeroVideo";
import ScrollToTop from "@/components/ScrollToTop";
import MiniArchiveBrowser from "@/components/MiniArchiveBrowser";

export const metadata: Metadata = {
  title: "The Expected World — An archive of expired futures",
  description:
    "A curated archive of predictions, prophecies, and forecasts — tracking when the future was supposed to arrive.",
};

export default function HomePage() {
  const archiveEntries = getArchiveEntries();
  const archiveCount = archiveEntries.length;

  // The browser owns the chronological ordering for each date mode.
  const archiveForBrowser = archiveEntries.map(entry => ({
    id: entry.id,
    quote: entry.quote,
    author: entry.author,
    dateWritten: entry.dateWritten,
    predictedDateNormalized: entry.predictedDateNormalized,
    category: entry.category,
    is_fiction: entry.is_fiction,
  }));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Expected World",
    url: "https://theexpectedworld.com",
    description: "A curated archive of predictions, prophecies, and forecasts — tracking when the future was supposed to arrive.",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Expected World",
    url: "https://theexpectedworld.com",
    logo: "https://theexpectedworld.com/favicon.svg",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteJsonLd, orgJsonLd]) }}
      />
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
                We select passages written before the futures they describe,
                anchored to a recognizable date or period, traceable to an
                original source, and worth encountering again. The quotations
                stand on their own, without our verdict on what came to pass.
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

      {/* A quiet tonal passage from the archive to the footer. */}
      <div className="hp-footer-transition" aria-hidden="true" />
    </div>
  );
}

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
