import { SubmitForm } from "@/components/SubmitForm";
import type { Metadata } from "next";
import PaintCanvas from "@/components/PaintCanvas";
import ScrollReveal from "@/components/ScrollReveal";

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
        className="grid-bg hero-section"
        style={{
          padding: "180px 48px 80px",
          position: "relative",
          overflow: "hidden",
          background: "var(--black)",
          textAlign: "center",
        }}
      >
        <PaintCanvas />
        <ScrollReveal delay={0}>
          <h1
            className="section-title"
            style={{ fontSize: "4rem", color: "var(--text-d)", margin: 0 }}
          >
            SUBMIT A PASSAGE
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
            Know a prediction we are missing? Help us build the archive.
          </p>
        </ScrollReveal>
      </section>

      {/* Cream form section */}
      <section
        className="cream-section"
        style={{
          padding: "80px 48px",
          background: "var(--cream)",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <SubmitForm />
          <p
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.6875rem",
              color: "var(--muted-l)",
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
