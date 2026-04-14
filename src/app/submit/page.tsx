import { SubmitForm } from "@/components/SubmitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Passage",
  description: "Know a historical prediction we should feature? Submit it here.",
  alternates: { canonical: "/submit" },
};

export default function SubmitPage() {
  return (
    <div>
      {/* Dark hero */}
      <section
        className="grid-bg"
        style={{
          padding: "160px 48px 80px",
          background: "var(--black)",
          textAlign: "center",
        }}
      >
        <span className="section-label" style={{ marginBottom: "16px", display: "block" }}>
          contribute to the archive
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "var(--text-on-dark)",
            marginBottom: "16px",
          }}
        >
          Submit a Passage
        </h1>
        <p
          style={{
            fontFamily: "var(--font-quote)",
            fontStyle: "italic",
            fontSize: "1.125rem",
            color: "var(--muted-dark)",
          }}
        >
          Know a prediction we are missing? Help us build the archive.
        </p>
      </section>

      {/* Cream form section */}
      <section
        style={{
          background: "var(--cream)",
          color: "var(--text-on-light)",
          padding: "80px 48px",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <SubmitForm />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--muted-light)",
              letterSpacing: "0.04em",
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            All submissions are reviewed before publishing.
          </p>
        </div>
      </section>
    </div>
  );
}
