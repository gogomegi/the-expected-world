import { SubmitForm } from "@/components/SubmitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Passage",
  description:
    "Know a historical prediction we should feature? Submit it here.",
};

export default function SubmitPage() {
  return (
    <div>
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
          Submit a Passage
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            fontStyle: "italic",
            color: "var(--color-secondary)",
            marginTop: "var(--space-2)",
          }}
        >
          Know a prediction we are missing? Help us build the archive.
        </p>
      </section>

      <div
        style={{
          maxWidth: "var(--max-width-prose)",
          margin: "0 auto",
          padding: "0 var(--space-6) var(--space-7)",
        }}
      >
        <SubmitForm />
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            color: "var(--color-secondary)",
            letterSpacing: "0.04em",
            textAlign: "center",
            marginTop: "var(--space-3)",
          }}
        >
          All submissions are reviewed before publishing.
        </p>
      </div>
    </div>
  );
}
