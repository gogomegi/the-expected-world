"use client";

import { useState } from "react";

export function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-surface border border-divider rounded-lg p-8 max-w-[640px] mx-auto text-center">
        <h2 className="font-display font-semibold text-2xl mb-4">
          Prediction Submitted
        </h2>
        <p className="text-dusk mb-6">
          Thanks! We&apos;ll review it and add it to the archive if it fits.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-brass text-sm hover:text-brass-bright hover:underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-divider rounded-lg p-8 max-w-[640px] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="text"
            className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
          >
            The prediction <span className="text-brass">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            rows={4}
            required
            className="w-full min-h-[120px] bg-elevated border border-divider rounded px-4 py-3 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all resize-y"
            placeholder="Paste or type the prediction text..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="author"
              className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
            >
              Who said it? <span className="text-brass">*</span>
            </label>
            <input
              id="author"
              name="author"
              type="text"
              required
              className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="yearWritten"
              className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
            >
              Year written <span className="text-brass">*</span>
            </label>
            <input
              id="yearWritten"
              name="yearWritten"
              type="number"
              required
              className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="yearImagined"
              className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
            >
              Year they imagined
            </label>
            <input
              id="yearImagined"
              name="yearImagined"
              type="text"
              className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass focus:shadow-[0_0_0_2px_rgba(201,168,76,0.2)] transition-all"
              placeholder="e.g. 2000, 2000s"
            />
          </div>
          <div>
            <label
              htmlFor="topic"
              className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
            >
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment focus:outline-none focus:border-brass transition-all appearance-none"
            >
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
          <label
            htmlFor="source"
            className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
          >
            Source URL or reference
          </label>
          <input
            id="source"
            name="source"
            type="text"
            className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass transition-all"
            placeholder="Book, article, URL..."
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-medium text-[13px] uppercase tracking-[0.04em] text-dusk mb-1.5"
          >
            Your email (optional, for credit)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full h-11 bg-elevated border border-divider rounded px-4 text-sm text-parchment placeholder:text-graphite focus:outline-none focus:border-brass transition-all"
          />
        </div>

        {status === "error" && (
          <p className="text-crimson text-sm">
            Something went wrong. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full h-12 bg-brass text-deep-ink font-medium text-sm uppercase tracking-[0.04em] rounded hover:bg-brass-bright transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting..." : "Submit Prediction"}
        </button>
      </form>
    </div>
  );
}
