"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  quote: string;
  author: string;
  year: string;
}

function truncateQuote(quote: string, max: number): string {
  if (quote.length <= max) return quote;
  return quote.slice(0, max).trimEnd() + "\u2026";
}

export default function ShareButtons({
  url,
  quote,
  author,
  year,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://theexpectedworld.com${url}`;
  const shortQuote = truncateQuote(quote, 120);
  const shareText = `\u201C${shortQuote}\u201D \u2014 ${author}, ${year}. Did this prediction expire?`;

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
  const emailSubject = `${author} \u2014 The Expected World`;
  const emailBody = `${shareText}\n\n${fullUrl}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="share-buttons">
      <span className="share-label">Share</span>
      <div className="share-icons">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <button
          onClick={copyLink}
          className="share-btn"
          aria-label="Copy link"
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
        <a
          href={emailUrl}
          className="share-btn"
          aria-label="Share via email"
          title="Share via email"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
