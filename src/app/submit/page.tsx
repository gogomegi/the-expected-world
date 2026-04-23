import type { Metadata } from "next";

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
          <p style={pageLabelStyle}>Submit</p>
          <p style={subtitleStyle}>
            Know a prediction we are missing? Help us build the archive.
          </p>

          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label htmlFor="quote" style={labelStyle}>
                The prediction <span style={{ color: "var(--orange)" }}>*</span>
              </label>
              <div className="input-frame">
                <textarea
                  id="quote"
                  name="quote"
                  rows={5}
                  required
                  placeholder="Paste or type the prediction text..."
                />
              </div>
            </div>

            <div className="sf-grid-2">
              <div>
                <label htmlFor="author" style={labelStyle}>
                  Who said it? <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <div className="input-frame">
                  <input id="author" name="author" type="text" required />
                </div>
              </div>
              <div>
                <label htmlFor="yearWritten" style={labelStyle}>
                  Year written <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <div className="input-frame">
                  <input id="yearWritten" name="yearWritten" type="number" required />
                </div>
              </div>
            </div>

            <div className="sf-grid-2">
              <div>
                <label htmlFor="yearImagined" style={labelStyle}>
                  Year they imagined
                </label>
                <div className="input-frame">
                  <input id="yearImagined" name="yearImagined" type="text" placeholder="e.g. 2000, 2000s" />
                </div>
              </div>
              <div>
                <label htmlFor="topic" style={labelStyle}>
                  Topic
                </label>
                <div className="input-frame">
                  <select id="topic" name="topic">
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
            </div>

            <div>
              <label htmlFor="source" style={labelStyle}>
                Source URL or reference
              </label>
              <div className="input-frame">
                <input id="source" name="source" type="text" placeholder="Book, article, URL..." />
              </div>
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>
                Your email (optional, for credit)
              </label>
              <div className="input-frame">
                <input id="email" name="email" type="email" />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                height: "44px",
                background: "var(--text-l)",
                color: "var(--cream)",
                fontFamily: "var(--fm)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              Submit Prediction
            </button>
          </form>
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

const pageLabelStyle: React.CSSProperties = {
  fontFamily: "var(--fm)",
  fontSize: "0.5625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted-l)",
  marginBottom: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "var(--fq)",
  fontStyle: "italic",
  fontSize: "0.8125rem",
  lineHeight: 1.6,
  color: "var(--text-l)",
  opacity: 0.5,
  marginBottom: "32px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--fh)",
  fontSize: "0.6875rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-l)",
  marginBottom: "6px",
};
