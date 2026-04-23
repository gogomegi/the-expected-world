"use client";

import { useState, useMemo } from "react";
import { getArchiveEntries, isExpired, displayYear } from "@/lib/corpus";
import type { Entry } from "@/lib/corpus";
import Link from "next/link";
import dynamic from "next/dynamic";
import CounterYear from "@/components/CounterYear";

const TimelineSlider = dynamic(() => import("@/components/TimelineSlider"), { ssr: false });

const COLOR_VARS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--amber)"];

export default function TimelinePage() {
  const allEntries = useMemo(() => getArchiveEntries(), []);
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
              {total} entries · {maxYear - minYear} years
            </span>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <TimelineSlider minYear={minYear} maxYear={maxYear} onChange={setFilterYear} />
          </div>

          <div className="archive-grid">
            {filterYear === null
              ? allEntries.map((entry, i) => (
                  <ArchiveCard key={entry.id} entry={entry} index={i} opacity={1} />
                ))
              : (visibleEntries as { entry: Entry; opacity: number }[]).map(({ entry, opacity }, i) => (
                  <ArchiveCard key={entry.id} entry={entry} index={i} opacity={opacity} />
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

function ArchiveCard({ entry, index, opacity }: { entry: Entry; index: number; opacity: number }) {
  const yearStr = displayYear(entry);
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
            {isExpired(entry.predictedDateNormalized) ? "expires" : "closing"}
          </span>
          <span className="ac-yr" style={{ fontSize: "1.5rem" }}>
            <CounterYear year={parseInt(yearStr) || 0} />
          </span>
          {entry.is_fiction && <span className="fiction-badge">FICTION</span>}
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
