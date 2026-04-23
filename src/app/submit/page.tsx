import type { Metadata } from "next";
import LazyPaintCanvas from "@/components/LazyPaintCanvas";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Submit a Passage",
  description:
    "Know a historical prediction we should feature? Submit it here.",
};

export default function SubmitPage() {
  return (
    <div>
      {/* Dark hero — same as About page */}
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
          <p className="section-label" style={{ marginBottom: "16px" }}>
            Contribute to the archive
          </p>
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

      {/* Cream form body */}
      <section
        className="cream-section"
        style={{
          padding: "80px 48px",
          background: "var(--cream)",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "var(--white)",
            border: "1px solid var(--rule-l)",
            borderRadius: "8px",
            padding: "40px",
          }}
        >
          <form style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label htmlFor="quote" style={labelStyle}>
                The prediction <span style={{ color: "var(--orange)" }}>*</span>
              </label>
              <textarea
                id="quote"
                name="quote"
                rows={5}
                required
                style={{ ...inputStyle, minHeight: "140px", resize: "vertical" as const, paddingTop: "12px", paddingBottom: "12px" }}
                placeholder="Paste or type the prediction text..."
              />
            </div>

            <div className="sf-grid-2">
              <div>
                <label htmlFor="author" style={labelStyle}>
                  Who said it? <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="yearWritten" style={labelStyle}>
                  Year written <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <input
                  id="yearWritten"
                  name="yearWritten"
                  type="number"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="sf-grid-2">
              <div>
                <label htmlFor="yearImagined" style={labelStyle}>
                  Year they imagined
                </label>
                <input
                  id="yearImagined"
                  name="yearImagined"
                  type="text"
                  style={inputStyle}
                  placeholder="e.g. 2000, 2000s"
                />
              </div>
              <div>
                <label htmlFor="topic" style={labelStyle}>
                  Topic
                </label>
                <select id="topic" name="topic" style={inputStyle}>
                  <option value="">Select a topic...</option>
                  <option value="Technology">Technology</option>
                  <option value="AI & Robots">AI &amp; Robots</option>
                  <option value="Space">Space</option>
                  <option value="Society">Society</option>
                  <option value="Environment">Environment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Communication">Communication</option>
                  <option value="Health & Medicine">Health &amp; Medicine</option>
                  <option value="Economy">Economy</option>
                  <option value="Energy">Energy</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food & Agriculture">Food &amp; Agriculture</option>
                  <option value="War & Politics">War &amp; Politics</option>
                  <option value="Culture & Entertainment">Culture &amp; Entertainment</option>
                  <option value="Population">Population</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="source" style={labelStyle}>
                Source URL or reference
              </label>
              <input
                id="source"
                name="source"
                type="text"
                style={inputStyle}
                placeholder="Book, article, URL..."
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>
                Your email (optional, for credit)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                height: "48px",
                background: "var(--text-l)",
                color: "var(--cream)",
                fontFamily: "var(--fh)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit Prediction
            </button>
          </form>
        </div>

        <p
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.8125rem",
            color: "var(--muted-l)",
            textAlign: "center" as const,
            marginTop: "24px",
          }}
        >
          All submissions are reviewed before publishing.
        </p>
      </section>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--fh)",
  fontSize: "0.8125rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-l)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  background: "var(--white)",
  border: "1px solid var(--rule-l)",
  borderRadius: "4px",
  padding: "0 16px",
  fontFamily: "var(--fh)",
  fontSize: "0.875rem",
  color: "var(--text-l)",
};
