import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Expected World is an archival publication that surfaces texts originally written about the future.",
  alternates: { canonical: "/about" },
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "0.875rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-on-light)",
  marginBottom: "16px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "var(--text-on-light)",
  opacity: 0.8,
};

const paragraphStyle: React.CSSProperties = {
  ...bodyStyle,
  marginBottom: "1.25rem",
};

export default function AboutPage() {
  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section
        className="grid-bg"
        style={{
          background: "var(--black)",
          padding: "160px 48px 80px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.75rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--text-on-dark)",
            margin: "0 0 20px",
          }}
        >
          About This Archive
        </h1>
        <p
          style={{
            fontFamily: "var(--font-quote)",
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "var(--muted-dark)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          What it is, how entries are selected, and how to contribute.
        </p>
      </section>

      {/* ═══ CONTENT — cream section ═══ */}
      <section
        style={{
          background: "var(--cream)",
          color: "var(--text-on-light)",
          padding: "80px 48px 120px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {/* What This Is */}
          <h2 style={sectionHeadingStyle}>What This Is</h2>
          <p style={paragraphStyle}>
            The Expected World is an archival publication that surfaces texts
            originally written about the future — predictions, forecasts, policy
            projections, fictional imaginings — each anchored to a specific date
            or period that has now elapsed.
          </p>
          <p style={paragraphStyle}>
            The site exists to create a particular kind of encounter: a reader
            meets a mind from the past speaking confidently, or anxiously, or
            hopefully, about a moment the reader has already lived through. The
            gap between expectation and outcome is the editorial territory.
          </p>
          <p style={paragraphStyle}>
            This is not a retro-futurism blog. We do not present the past as
            quaint or its predictions as fodder for amusement. A prediction is
            not interesting merely because it was wrong. It is interesting when
            the texture of the expectation — what was assumed, what was feared,
            what was considered obvious — reveals something about the mind that
            produced it, the era it emerged from, or the world we actually built.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--rule-light)",
              margin: "48px 0",
            }}
          />

          {/* How Entries Are Selected */}
          <h2 style={sectionHeadingStyle}>How Entries Are Selected</h2>
          <p style={paragraphStyle}>
            Every entry must satisfy four criteria. The source text must
            reference a specific future date, year, or bounded period. The
            predicted date must be in the past. The source must be verifiable.
            And the pairing of prediction and elapsed reality must reward
            attention.
          </p>
          <p style={paragraphStyle}>
            The fourth criterion is the most important and the most subjective.
            Ask: does this entry surface a genuine surprise, a buried
            assumption, a forgotten anxiety, an uncanny accuracy, or a telling
            blind spot? If yes, it belongs. If it merely demonstrates that
            people in the past did not have perfect foresight, it does not.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--rule-light)",
              margin: "48px 0",
            }}
          />

          {/* Editorial Standards */}
          <h2 style={sectionHeadingStyle}>Editorial Standards</h2>
          <p style={paragraphStyle}>
            The voice of The Expected World is intellectual but not academic,
            concise but not glib. We write for readers who are curious, literate,
            and impatient with padding. Annotations provide context; they do not
            editorialize, moralize, or gloat. The governing question is always:
            would a thoughtful reader feel this was worth their attention?
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--rule-light)",
              margin: "48px 0",
            }}
          />

          {/* Contact & Submissions */}
          <h2 style={sectionHeadingStyle}>Contact & Submissions</h2>
          <p style={paragraphStyle}>
            If you have found a passage that meets our criteria, we would like
            to hear about it.{" "}
            <Link
              href="/submit"
              style={{
                color: "var(--vivid-orange)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Submit a passage
            </Link>
            .
          </p>
          <p style={{ ...bodyStyle, margin: 0 }}>
            For other inquiries:{" "}
            <a
              href="mailto:contact@theexpectedworld.com"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                color: "var(--vivid-orange)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              contact@theexpectedworld.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
