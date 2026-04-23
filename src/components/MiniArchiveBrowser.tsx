"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const TimelineSlider = dynamic(() => import("@/components/TimelineSlider"), { ssr: false });

interface ArchiveEntry {
  id: string;
  quote: string;
  author: string;
  predictedDateNormalized: string;
  category: string;
  is_fiction?: boolean;
}

const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

export default function MiniArchiveBrowser({ entries }: { entries: ArchiveEntry[] }) {
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const [minYear, maxYear] = useMemo(() => {
    let min = 9999, max = 0;
    for (const e of entries) {
      const y = parseInt(e.predictedDateNormalized.slice(0, 4));
      if (y < min) min = y;
      if (y > max) max = y;
    }
    return [min, max];
  }, [entries]);

  const currentEntry = useMemo(() => {
    if (filterYear === null) return entries[0];
    let closest = entries[0];
    let closestDist = Infinity;
    for (const e of entries) {
      const y = parseInt(e.predictedDateNormalized.slice(0, 4));
      const dist = Math.abs(y - filterYear);
      if (dist < closestDist) {
        closestDist = dist;
        closest = e;
      }
    }
    return closest;
  }, [entries, filterYear]);

  if (!currentEntry) return null;

  const yearStr = currentEntry.predictedDateNormalized.slice(0, 4);
  const hoverBg = COLOR_VARS[entries.indexOf(currentEntry) % COLOR_VARS.length];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <TimelineSlider minYear={minYear} maxYear={maxYear} onChange={setFilterYear} />
      </div>

      <Link href={`/entry/${currentEntry.id}`}>
        <div className="ac-light">
          <div className="ac-hover-bg" style={{ background: hoverBg }} />
          <span className="ac-ghost">{yearStr}</span>
          <div className="ac-top" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative", zIndex: 1 }}>
            <span className="ac-el" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-l)" }}>
              expires
            </span>
            <span className="ac-yr" style={{ fontSize: "1.5rem", fontFamily: "var(--fh)", fontWeight: 900 }}>
              {yearStr}
            </span>
            {currentEntry.is_fiction && <span className="fiction-badge">FICTION</span>}
          </div>
          <p className="ac-excerpt" style={{ fontFamily: "var(--fq)", fontStyle: "italic", fontSize: "0.875rem", lineHeight: 1.5, color: "var(--text-l)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", position: "relative", zIndex: 1 }}>
            &ldquo;{currentEntry.quote}&rdquo;
          </p>
          <div className="ac-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, position: "relative", zIndex: 1 }}>
            <span className="ac-auth" style={{ fontFamily: "var(--fh)", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text-l)" }}>{currentEntry.author}</span>
            <span className="ac-cat" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-l)" }}>{currentEntry.category}</span>
          </div>
        </div>
      </Link>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Link
          href="/timeline"
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.625rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-l)",
            opacity: 0.5,
          }}
        >
          View more →
        </Link>
      </div>
    </div>
  );
}
