"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ArchiveChronologyControls from "@/components/ArchiveChronologyControls";
import { getChronologyYear, sortChronologically } from "@/lib/archive-chronology";
import type { ArchiveDateMode } from "@/lib/archive-chronology";

interface ArchiveEntry {
  id: string;
  quote: string;
  author: string;
  dateWritten: string;
  predictedDateNormalized: string;
  category: string;
  is_fiction?: boolean;
}

const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

export default function MiniArchiveBrowser({ entries }: { entries: ArchiveEntry[] }) {
  const [mode, setMode] = useState<ArchiveDateMode>("written");
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const chronologicalEntries = useMemo(
    () => sortChronologically(entries, mode),
    [entries, mode]
  );

  const [minYear, maxYear] = useMemo(() => {
    const years = entries
      .map((entry) => getChronologyYear(entry, mode))
      .filter((year): year is number => year !== null);
    return years.length ? [Math.min(...years), Math.max(...years)] : [0, 0];
  }, [entries, mode]);

  const currentEntry = useMemo(() => {
    if (filterYear === null) return chronologicalEntries[0];
    let closest = chronologicalEntries[0];
    let closestDist = Number.POSITIVE_INFINITY;
    for (const entry of chronologicalEntries) {
      const year = getChronologyYear(entry, mode);
      if (year === null) continue;
      const dist = Math.abs(year - filterYear);
      if (dist < closestDist) {
        closestDist = dist;
        closest = entry;
      }
    }
    return closest;
  }, [chronologicalEntries, filterYear, mode]);

  function changeMode(nextMode: ArchiveDateMode) {
    setMode(nextMode);
    setFilterYear(null);
  }

  if (!currentEntry) return null;

  const yearStr = getChronologyYear(currentEntry, mode)?.toString() ?? "Unknown";
  const hoverBg = COLOR_VARS[chronologicalEntries.indexOf(currentEntry) % COLOR_VARS.length];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <ArchiveChronologyControls mode={mode} onModeChange={changeMode} minYear={minYear} maxYear={maxYear} selectedYear={filterYear} onYearChange={setFilterYear} />
      </div>

      <Link href={`/entry/${currentEntry.id}`}>
        <div className="ac-light">
          <div className="ac-hover-bg" style={{ background: hoverBg }} />
          <span className="ac-ghost">{yearStr}</span>
          <div className="ac-top" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative", zIndex: 1 }}>
            <span className="ac-el" style={{ fontFamily: "var(--fm)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-l)" }}>
              {mode === "written" ? "written" : "imagined"}
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
