import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Expected World is an archival publication that surfaces texts originally written about the future.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <section style={{ padding: "120px 48px 80px" }}>
        <div className="phone-frame-outer" style={{ maxWidth: "780px" }}>
        <div className="phone-frame-inner">
          <p style={pageLabelStyle}>About</p>

          <h2 style={sectionHeadStyle}>What This Is</h2>
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
          <h2 style={sectionHeadStyle}>How Entries Are Selected</h2>
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
                fontSize: "0.8125rem",
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
