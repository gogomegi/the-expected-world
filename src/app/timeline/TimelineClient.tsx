"use client";

import { useState, useMemo } from "react";
import type { Entry } from "@/lib/corpus";
import { getChronologyYear, sortChronologically } from "@/lib/archive-chronology";
import type { ArchiveDateMode } from "@/lib/archive-chronology";
import Link from "next/link";

function isExpired(date: string): boolean {
  return date <= new Date().toISOString().slice(0, 10);
}

function displayYear(entry: Entry): string {
  const match = entry.predictedDate.match(/(\d+)(?:st|nd|rd|th)\s+century/i);
  if (/distant future|approx/i.test(entry.predictedDate)) {
    return match ? `~${match[1]}${Number(match[1]) === 21 ? "st" : Number(match[1]) === 22 ? "nd" : "th"} century` : entry.predictedDateNormalized.slice(0, 4);
  }
  return entry.predictedDateNormalized.slice(0, 4);
}

import ArchiveChronologyControls from "@/components/ArchiveChronologyControls";
import CounterYear from "@/components/CounterYear";


const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

export default function TimelineClient({ allEntries }: { allEntries: Entry[] }) {
  const total = allEntries.length;

  const [mode, setMode] = useState<ArchiveDateMode>("written");
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const chronologicalEntries = useMemo(
    () => sortChronologically(allEntries, mode),
    [allEntries, mode]
  );

  const [minYear, maxYear] = useMemo(() => {
    const years = allEntries
      .map((entry) => getChronologyYear(entry, mode))
      .filter((year): year is number => year !== null);
    return years.length ? [Math.min(...years), Math.max(...years)] : [0, 0];
  }, [allEntries, mode]);

  const visibleEntries = useMemo(() => {
    if (filterYear === null) return chronologicalEntries.map((entry) => ({ entry, opacity: 1 }));
    return chronologicalEntries.flatMap((entry) => {
      const year = getChronologyYear(entry, mode);
      if (year === null) return [];
      const distance = Math.abs(year - filterYear);
      if (distance > 15) return [];
      return [{ entry, opacity: Math.max(0.15, 1 - distance / 15) }];
    });
  }, [chronologicalEntries, mode, filterYear]);

  function changeMode(nextMode: ArchiveDateMode) {
    setMode(nextMode);
    setFilterYear(null);
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <section style={{ padding: "120px 48px 80px" }}>
        <div className="phone-frame-outer">
        <div className="phone-frame-inner">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "24px" }}>
            <p style={pageLabelStyle}>Archive</p>
            <span
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.5625rem",
                letterSpacing: "0.06em",
                color: "var(--muted-l)",
              }}
            >
              {total} entries · {mode === "written" ? "chronological by year written" : "chronological by year imagined"}
            </span>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <ArchiveChronologyControls mode={mode} onModeChange={changeMode} minYear={minYear} maxYear={maxYear} selectedYear={filterYear} onYearChange={setFilterYear} />
          </div>

          <div className="archive-grid">
            {visibleEntries.map(({ entry, opacity }, i) => (
              <ArchiveCard key={entry.id} entry={entry} index={i} opacity={opacity} mode={mode} />
            ))}
          </div>
          {filterYear !== null && visibleEntries.length === 0 && (
            <p
              style={{
                fontFamily: "var(--fq)",
                fontStyle: "italic",
                fontSize: "0.875rem",
                color: "var(--muted-l)",
                textAlign: "center",
                marginTop: "48px",
              }}
            >
              No entries near {filterYear}.
            </p>
          )}
        </div>
        </div>
      </section>
    </div>
  );
}

function ArchiveCard({ entry, index, opacity, mode }: { entry: Entry; index: number; opacity: number; mode: ArchiveDateMode }) {
  const yearStr = mode === "written" ? (getChronologyYear(entry, "written")?.toString() ?? "Unknown") : displayYear(entry);
  const hoverBg = COLOR_VARS[index % COLOR_VARS.length];

  return (
    <Link href={`/entry/${entry.id}`} style={{ display: "block", textDecoration: "none", opacity, transition: "opacity 0.3s" }}>
      <div className="ac-light">
        <div
          className="ac-hover-bg"
          style={{ background: hoverBg }}
        />
        <span className="ac-ghost">{yearStr}</span>
        <div
          className="ac-top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="ac-el"
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.5625rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-l)",
            }}
          >
            {mode === "written" ? "written" : "imagined"}
          </span>
          <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
            <CounterYear year={parseInt(yearStr) || 0} />
          </span>
          {entry.is_fiction && <span className="fiction-badge">FICTION</span>}
          <span className="ac-el" style={{ fontSize: "0.5625rem", color: "var(--muted-l)", marginLeft: "auto" }}>{isExpired(entry.predictedDateNormalized) ? "expired" : "closing"}</span>
        </div>
        <p
          className="ac-excerpt"
          style={{
            fontFamily: "var(--fq)",
            fontStyle: "italic",
            fontSize: "0.9375rem",
            lineHeight: 1.55,
            color: "var(--text-l)",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          &ldquo;{entry.quote}&rdquo;
        </p>
        <div
          className="ac-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="ac-auth"
            style={{
              fontFamily: "var(--fh)",
              fontWeight: 600,
              fontSize: "0.75rem",
              color: "var(--text-l)",
            }}
          >
            {entry.author}
          </span>
          <span
            className="ac-cat"
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.5625rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--muted-l)",
            }}
          >
            {entry.category}
          </span>
        </div>
      </div>
    </Link>
  );
}

const pageLabelStyle: React.CSSProperties = {
  fontFamily: "var(--fm)",
  fontSize: "0.5625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted-l)",
  margin: 0,
};
