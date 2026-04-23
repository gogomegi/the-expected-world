"use client";

import { useState } from "react";

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

export default function SubmitFormClient() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      quote: formData.get("quote") as string,
      author: formData.get("author") as string,
      yearWritten: formData.get("yearWritten") as string,
      yearImagined: (formData.get("yearImagined") as string) || undefined,
      topic: (formData.get("topic") as string) || undefined,
      source: (formData.get("source") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let message = "Submission failed";
        try {
          const data = await res.json();
          message = data.error || message;
        } catch {
          // Response body may not be JSON
        }
        throw new Error(message);
      }

      setSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <p style={pageLabelStyle}>Submit</p>
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p style={{
            fontFamily: "var(--fh)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text-l)",
            marginBottom: "12px",
          }}>
            Thank you!
          </p>
          <p style={{
            fontFamily: "var(--fq)",
            fontStyle: "italic",
            fontSize: "0.8125rem",
            color: "var(--text-l)",
            opacity: 0.6,
            marginBottom: "24px",
          }}>
            Your prediction has been submitted for review.
          </p>
          <button
            onClick={() => setSuccess(false)}
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "8px 24px",
              background: "transparent",
              color: "var(--text-l)",
              border: "1px solid var(--text-l)",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Submit another
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <p style={pageLabelStyle}>Submit</p>
      <p style={subtitleStyle}>
        Know a prediction we are missing? Help us build the archive.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

        {error && (
          <p style={{
            fontFamily: "var(--fm)",
            fontSize: "0.6875rem",
            color: "#C03A1E",
            margin: 0,
          }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            height: "44px",
            background: submitting ? "var(--muted-l)" : "var(--text-l)",
            color: "var(--cream)",
            fontFamily: "var(--fm)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            border: "none",
            borderRadius: "14px",
            cursor: submitting ? "wait" : "pointer",
            marginTop: "4px",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Submitting..." : "Submit Prediction"}
        </button>
      </form>
    </>
  );
}
