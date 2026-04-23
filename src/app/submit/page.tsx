import type { Metadata } from "next";
import SubmitFormClient from "./SubmitFormClient";

export const metadata: Metadata = {
  title: "Submit a Passage",
  description:
    "Know a historical prediction we should feature? Submit it here.",
};

export default function SubmitPage() {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <section style={{ padding: "120px 48px 80px" }}>
        <div className="phone-frame-outer" style={{ maxWidth: "780px" }}>
        <div className="phone-frame-inner">
          <SubmitFormClient />
        </div>
        </div>

        <p
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.625rem",
            color: "var(--muted-l)",
            textAlign: "center",
            marginTop: "20px",
            letterSpacing: "0.04em",
          }}
        >
          All submissions are reviewed before publishing.
        </p>
      </section>
    </div>
  );
}
