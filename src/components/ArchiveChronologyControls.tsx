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
            alignItems: "center",
            columnGap: 8,
            rowGap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.625rem",
              letterSpacing: "0.04em",
              color: "var(--muted-l)",
              marginRight: 6,
            }}
          >
            Browse by
          </span>
          {choices.map((choice) => (
            <button
              type="button"
              key={choice.id}
              aria-pressed={mode === choice.id}
              onClick={() => onModeChange(choice.id)}
              style={{
                fontFamily: "var(--fm)",
                fontSize: "0.625rem",
                letterSpacing: "0.02em",
                padding: "7px 12px",
                borderRadius: 16,
                background: mode === choice.id ? "var(--text-l)" : "transparent",
                border: "1px solid var(--text-l)",
                color: mode === choice.id ? "var(--cream)" : "var(--text-l)",
                cursor: "pointer",
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
