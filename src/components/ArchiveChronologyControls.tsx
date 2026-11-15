"use client";

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
  const choices: { id: ArchiveDateMode; label: string }[] = [
    { id: "written", label: "Written date" },
    { id: "imagined", label: "Imagined date" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          columnGap: 20,
          rowGap: 14,
          marginBottom: 44,
        }}
      >
        <span
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.5625rem",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted-l)",
          }}
        >
          Archive
        </span>
        <div
          role="group"
          aria-label="Browse archive by date"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            columnGap: 18,
            rowGap: 8,
          }}
        >
          {choices.map((choice) => (
            <button
              type="button"
              key={choice.id}
              aria-pressed={mode === choice.id}
              onClick={() => onModeChange(choice.id)}
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.6875rem",
                letterSpacing: "0.03em",
                padding: "0 0 5px",
                border: "none",
                borderBottom: mode === choice.id ? "1px solid var(--text-l)" : "1px solid transparent",
                borderRadius: 0,
                background: "transparent",
                color: "var(--text-l)",
                fontWeight: mode === choice.id ? 600 : 400,
                opacity: mode === choice.id ? 1 : 0.45,
                cursor: "pointer",
                transition: "opacity 150ms ease, border-color 150ms ease",
              }}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>

      <TimelineSlider
        minYear={minYear}
        maxYear={maxYear}
        selectedYear={selectedYear}
        onChange={onYearChange}
        allLabel="All Eras"
      />
    </div>
  );
}
