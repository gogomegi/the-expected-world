"use client";

import { useEffect, useState } from "react";
import type { ArchiveDateMode } from "@/lib/archive-chronology";
import TimelineSlider from "@/components/TimelineSlider";

interface Props {
  mode: ArchiveDateMode;
  onModeChange: (mode: ArchiveDateMode) => void;
  minYear: number;
  maxYear: number;
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export default function ArchiveChronologyControls({
  mode, onModeChange, minYear, maxYear, selectedYear, onYearChange,
}: Props) {
  const [typedYear, setTypedYear] = useState("");

  useEffect(() => {
    setTypedYear(selectedYear === null ? "" : String(selectedYear));
  }, [selectedYear, mode]);

  function submitYear(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!typedYear.trim()) {
      onYearChange(null);
      return;
    }
    const year = Number(typedYear);
    if (Number.isInteger(year) && year >= minYear && year <= maxYear) {
      onYearChange(year);
    }
  }

  const labels: { id: ArchiveDateMode; label: string }[] = [
    { id: "written", label: "Written" },
    { id: "imagined", label: "Imagined" },
  ];

  return (
    <div>
      <div
        role="group"
        aria-label="Browse archive by date"
        style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 22 }}
      >
        <span style={{ fontFamily: "var(--fm)", fontSize: "0.625rem", letterSpacing: "0.06em", color: "var(--muted-l)", marginRight: 8 }}>
          Browse by
        </span>
        {labels.map((choice) => (
          <button
            type="button"
            key={choice.id}
            aria-pressed={mode === choice.id}
            onClick={() => onModeChange(choice.id)}
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.6875rem",
              letterSpacing: "0.04em",
              padding: "8px 14px",
              borderRadius: 18,
              background: mode === choice.id ? "var(--text-l)" : "transparent",
              border: "1px solid var(--text-l)",
              color: mode === choice.id ? "var(--cream)" : "var(--text-l)",
              cursor: "pointer",
            }}
          >
            {choice.label} date
          </button>
        ))}
      </div>

      <TimelineSlider
        minYear={minYear}
        maxYear={maxYear}
        selectedYear={selectedYear}
        onChange={onYearChange}
        allLabel={mode === "written" ? "All written dates" : "All imagined dates"}
      />

      <form
        onSubmit={submitYear}
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 2 }}
      >
        <label htmlFor={mode + "-year-entry"} style={{ fontFamily: "var(--fm)", fontSize: "0.625rem", color: "var(--muted-l)" }}>
          Jump to year
        </label>
        <input
          id={mode + "-year-entry"}
          type="number"
          min={minYear}
          max={maxYear}
          step={1}
          value={typedYear}
          onChange={(event) => setTypedYear(event.target.value)}
          placeholder={String(minYear)}
          aria-label={mode === "written" ? "Year written" : "Year imagined"}
          style={{
            width: 100, height: 34, background: "var(--cream)",
            border: "1px solid var(--rule-l)", borderRadius: 5,
            padding: "0 10px", color: "var(--text-l)", fontFamily: "var(--fm)", fontSize: "0.75rem",
          }}
        />
        <button type="submit" style={{
          border: "1px solid var(--rule-l)", borderRadius: 5, padding: "7px 12px",
          background: "transparent", color: "var(--text-l)", fontFamily: "var(--fm)", fontSize: "0.6875rem", cursor: "pointer",
        }}>Go</button>
        {selectedYear !== null && (
          <button type="button" onClick={() => onYearChange(null)} style={{
            border: "none", background: "transparent", color: "var(--muted-l)",
            fontFamily: "var(--fm)", fontSize: "0.6875rem", padding: "7px 8px", cursor: "pointer",
          }}>Clear</button>
        )}
      </form>
    </div>
  );
}
