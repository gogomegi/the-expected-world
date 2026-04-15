"use client";

import { useState, useEffect, useMemo } from "react";
import { getEntriesByDecade, getConfirmedEntries, isExpired } from "@/lib/corpus";
import type { Entry } from "@/lib/corpus";
import Link from "next/link";
import dynamic from "next/dynamic";

const PaintCanvas = dynamic(() => import("@/components/PaintCanvas"), { ssr: false });
const TimelineSlider = dynamic(() => import("@/components/TimelineSlider"), { ssr: false });

const STRIPE_CLASSES = ["so", "sb", "sg", "sa"] as const;

export default function TimelinePage() {
  const allEntries = useMemo(() => getConfirmedEntries(), []);
  const total = allEntries.length;

  const [minYear, maxYear] = useMemo(() => {
    let min = 9999, max = 0;
    for (const e of allEntries) {
      const y = parseInt(e.predictedDateNormalized.slice(0, 4));
      if (y < min) min = y;
      if (y > max) max = y;
    }
    return [min, max];
  }, [allEntries]);

  const [filterYear, setFilterYear] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Archive — The Expected World";
  }, []);

  const visibleEntries = useMemo(() => {
    if (filterYear === null) return allEntries;
    return allEntries
      .map((e) => {
        const y = parseInt(e.predictedDateNormalized.slice(0, 4));
        const dist = Math.abs(y - filterYear);
        if (dist > 15) return null;
        return { entry: e, opacity: Math.max(0.15, 1 - dist / 15) };
      })
      .filter(Boolean) as { entry: Entry; opacity: number }[];
  }, [allEntries, filterYear]);

  return (
    <div>
      {/* Dark hero */}
      <section
        className="grid-bg hero-section"
        style={{
          padding: "160px 48px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "var(--black)",
        }}
      >
        <PaintCanvas />
        <p className="section-label" style={{ marginBottom: "12px" }}>
          The Complete Archive
        </p>
        <h1
          className="section-title"
          style={{ fontSize: "4rem", color: "var(--text-d)", margin: "0 0 16px" }}
        >
          ARCHIVE
        </h1>
        <p
          style={{
            fontFamily: "var(--fq)",
            fontStyle: "italic",
            fontSize: "1.125rem",
            color: "var(--muted-d)",
            marginBottom: "40px",
          }}
        >
          {total} entries spanning {maxYear - minYear} years of imagined futures.
        </p>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <TimelineSlider minYear={minYear} maxYear={maxYear} onChange={setFilterYear} />
        </div>
      </section>

      {/* Dark card grid */}
      <section
        className="dark-section"
        style={{
          padding: "64px 48px 120px",
          background: "var(--black)",
        }}
      >
        <div className="archive-grid">
          {filterYear === null
            ? allEntries.map((entry, i) => (
                <ArchiveCard key={entry.slug} entry={entry} index={i} opacity={1} />
              ))
            : (visibleEntries as { entry: Entry; opacity: number }[]).map(({ entry, opacity }, i) => (
                <ArchiveCard key={entry.slug} entry={entry} index={i} opacity={opacity} />
              ))}
        </div>
        {filterYear !== null && visibleEntries.length === 0 && (
          <p
            style={{
              fontFamily: "var(--fq)",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "var(--muted-d)",
              textAlign: "center",
              marginTop: "48px",
            }}
          >
            No entries near {filterYear}.
          </p>
        )}
      </section>
    </div>
  );
}

function ArchiveCard({ entry, index, opacity }: { entry: Entry; index: number; opacity: number }) {
  const stripe = STRIPE_CLASSES[index % 4];
  const year = entry.predictedDateNormalized.slice(0, 4);

  return (
    <Link href={`/entry/${entry.slug}`} style={{ display: "block", textDecoration: "none", opacity, transition: "opacity 0.3s" }}>
      <div className={`acd ${stripe}`}>
        <span className="acd-ghost">{year}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span
            style={{
              fontFamily: "var(--fh)",
              fontSize: "1.25rem",
              fontWeight: 900,
              color: "var(--text-d)",
            }}
          >
            {year}
          </span>
          {entry.isFiction && <span className="fiction-badge">FICTION</span>}
        </div>
        <p
          style={{
            fontFamily: "var(--fq)",
            fontStyle: "italic",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "rgba(245,242,235,0.7)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
            marginBottom: "16px",
          }}
        >
          {entry.text}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--rule-d)",
            paddingTop: "12px",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.6875rem",
              letterSpacing: "0.04em",
              color: "var(--muted-d)",
            }}
          >
            {entry.author.split(" ").slice(-1)[0]}
          </span>
          <span
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.625rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--muted-d)",
            }}
          >
            {entry.categories[0]}
          </span>
        </div>
      </div>
    </Link>
  );
}
