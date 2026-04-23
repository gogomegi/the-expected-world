import Link from "next/link";
import type { Metadata } from "next";
import LazyPaintCanvas from "@/components/LazyPaintCanvas";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description: "The Expected World is an archival publication that surfaces texts originally written about the future.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      {/* Dark hero */}
      <section
        className="grid-bg hero-section"
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
            ABOUT THIS ARCHIVE
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
            What it is, how entries are selected, and how to contribute.
          </p>
        </ScrollReveal>
      </section>

      {/* Cream body */}
      <section
        className="cream-section"
        style={{
          padding: "80px 48px",
          background: "var(--cream)",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* What This Is */}
          <h2
            style={{
              fontFamily: "var(--fh)",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-l)",
              marginBottom: "24px",
            }}
          >
            What This Is
          </h2>
          <p style={bodyStyle}>
            The Expected World is an archival publication that surfaces texts
            originally written about the future — predictions, forecasts, policy
            projections, fictional imaginings — each anchored to a specific date
            or period that has now elapsed.
          </p>
          <p style={bodyStyle}>
            The site exists to create a particular kind of encounter: a reader
            meets a mind from the past speaking confidently, or anxiously, or
            hopefully, about a moment the reader has already lived through. The
            gap between expectation and outcome is the editorial territory.
          </p>
          <p style={bodyStyle}>
            This is not a retro-futurism blog. We do not present the past as
            quaint or its predictions as fodder for amusement. A prediction is
            not interesting merely because it was wrong. It is interesting when
            the texture of the expectation — what was assumed, what was feared,
            what was considered obvious — reveals something about the mind that
            produced it, the era it emerged from, or the world we actually built.
          </p>

          <hr style={hrStyle} />

          {/* How Entries Are Selected */}
          <h2
            style={{
              fontFamily: "var(--fh)",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-l)",
              marginBottom: "24px",
            }}
          >
            How Entries Are Selected
          </h2>
          <p style={bodyStyle}>
            Every entry must satisfy four criteria. The source text must
            reference a specific future date, year, or bounded period. The
            predicted date must be in the past. The source must be verifiable.
            And the pairing of prediction and elapsed reality must reward
            attention.
          </p>
          <p style={bodyStyle}>
            The fourth criterion is the most important and the most subjective.
            Ask: does this entry surface a genuine surprise, a buried
            assumption, a forgotten anxiety, an uncanny accuracy, or a telling
            blind spot? If yes, it belongs. If it merely demonstrates that
            people in the past did not have perfect foresight, it does not.
          </p>

          <hr style={hrStyle} />

          {/* Editorial Standards */}
          <h2
            style={{
              fontFamily: "var(--fh)",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-l)",
              marginBottom: "24px",
            }}
          >
            Editorial Standards
          </h2>
          <p style={bodyStyle}>
            The voice of The Expected World is intellectual but not academic,
            concise but not glib. We write for readers who are curious, literate,
            and impatient with padding. Annotations provide context; they do not
            editorialize, moralize, or gloat. The governing question is always:
            would a thoughtful reader feel this was worth their attention?
          </p>

          <hr style={hrStyle} />

          {/* Contact & Submissions */}
          <h2
            style={{
              fontFamily: "var(--fh)",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-l)",
              marginBottom: "24px",
            }}
          >
            Contact & Submissions
          </h2>
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
                fontSize: "0.875rem",
                color: "var(--orange)",
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

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--fh)",
  fontSize: "1rem",
  lineHeight: 1.75,
  color: "var(--text-l)",
  marginBottom: "24px",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid var(--rule-l)",
  margin: "40px 0",
};
