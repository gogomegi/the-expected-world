import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Expected World is an archival publication that surfaces texts originally written about the future.",
};

export default function AboutPage() {
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
          About This Archive
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
          What it is, how entries are selected, and how to contribute.
        </p>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(120, 113, 103, 0.4)",
            maxWidth: "var(--max-width-prose)",
            margin: "0 auto",
          }}
        />
      </section>

      {/* Content */}
      <div
        style={{
          maxWidth: "var(--max-width-prose)",
          margin: "0 auto",
          padding: "0 var(--space-6) var(--space-7)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-chrome)",
            fontSize: "var(--text-ui)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--color-secondary)",
            textTransform: "uppercase",
            marginBottom: "var(--space-2)",
          }}
        >
          What This Is
        </p>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            lineHeight: 1.72,
            color: "var(--color-text)",
          }}
        >
          <p style={{ marginBottom: "1.25rem" }}>
            The Expected World is an archival publication that surfaces texts
            originally written about the future — predictions, forecasts, policy
            projections, fictional imaginings — each anchored to a specific date
            or period that has now elapsed.
          </p>
          <p style={{ marginBottom: "1.25rem" }}>
            The site exists to create a particular kind of encounter: a reader
            meets a mind from the past speaking confidently, or anxiously, or
            hopefully, about a moment the reader has already lived through. The
            gap between expectation and outcome is the editorial territory.
          </p>
          <p style={{ marginBottom: "1.25rem" }}>
            This is not a retro-futurism blog. We do not present the past as
            quaint or its predictions as fodder for amusement. A prediction is
            not interesting merely because it was wrong. It is interesting when
            the texture of the expectation — what was assumed, what was feared,
            what was considered obvious — reveals something about the mind that
            produced it, the era it emerged from, or the world we actually built.
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(120, 113, 103, 0.2)",
            margin: "var(--space-5) 0",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-chrome)",
            fontSize: "var(--text-ui)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--color-secondary)",
            textTransform: "uppercase",
            marginBottom: "var(--space-2)",
          }}
        >
          How Entries Are Selected
        </p>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            lineHeight: 1.72,
            color: "var(--color-text)",
          }}
        >
          <p style={{ marginBottom: "1.25rem" }}>
            Every entry must satisfy four criteria. The source text must
            reference a specific future date, year, or bounded period. The
            predicted date must be in the past. The source must be verifiable.
            And the pairing of prediction and elapsed reality must reward
            attention.
          </p>
          <p style={{ marginBottom: "1.25rem" }}>
            The fourth criterion is the most important and the most subjective.
            Ask: does this entry surface a genuine surprise, a buried
            assumption, a forgotten anxiety, an uncanny accuracy, or a telling
            blind spot? If yes, it belongs. If it merely demonstrates that
            people in the past did not have perfect foresight, it does not.
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(120, 113, 103, 0.2)",
            margin: "var(--space-5) 0",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-chrome)",
            fontSize: "var(--text-ui)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--color-secondary)",
            textTransform: "uppercase",
            marginBottom: "var(--space-2)",
          }}
        >
          Editorial Standards
        </p>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            lineHeight: 1.72,
            color: "var(--color-text)",
          }}
        >
          <p style={{ marginBottom: "1.25rem" }}>
            The voice of The Expected World is intellectual but not academic,
            concise but not glib. We write for readers who are curious, literate,
            and impatient with padding. Annotations provide context; they do not
            editorialize, moralize, or gloat. The governing question is always:
            would a thoughtful reader feel this was worth their attention?
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(120, 113, 103, 0.2)",
            margin: "var(--space-5) 0",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-chrome)",
            fontSize: "var(--text-ui)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--color-secondary)",
            textTransform: "uppercase",
            marginBottom: "var(--space-2)",
          }}
        >
          Contact & Submissions
        </p>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            lineHeight: 1.72,
            color: "var(--color-text)",
          }}
        >
          <p style={{ marginBottom: "1.25rem" }}>
            If you have found a passage that meets our criteria, we would like
            to hear about it.{" "}
            <Link
              href="/submit"
              style={{
                color: "var(--color-accent)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Submit a passage
            </Link>
            .
          </p>
          <p style={{ marginBottom: 0 }}>
            For other inquiries:{" "}
            <a
              href="mailto:contact@theexpectedworld.com"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sidebar)",
                color: "var(--color-accent)",
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
  );
}
