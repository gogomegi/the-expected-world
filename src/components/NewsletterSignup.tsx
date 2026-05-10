"use client";

import { useState } from "react";

export default function NewsletterSignup({
  variant = "footer",
}: {
  variant?: "footer" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (variant === "inline") {
    return (
      <div className="newsletter-inline">
        <div className="newsletter-inline-inner">
          <p className="newsletter-label">Tomorrow, Yesterday</p>
          <p className="newsletter-desc">
            A prediction from the past, delivered to your inbox.
          </p>
          {status === "success" ? (
            <p className="newsletter-success">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="input-frame" style={{ flex: 1 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <button
                type="submit"
                className="newsletter-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? "…" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="newsletter-error">{message}</p>
          )}
          <p className="newsletter-fine">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    );
  }

  // Footer variant
  return (
    <div className="newsletter-footer">
      <p className="newsletter-footer-label">Newsletter</p>
      {status === "success" ? (
        <p className="newsletter-success">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-footer-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            className="newsletter-footer-input"
          />
          <button
            type="submit"
            className="newsletter-footer-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? "…" : "→"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="newsletter-error">{message}</p>
      )}
    </div>
  );
}
