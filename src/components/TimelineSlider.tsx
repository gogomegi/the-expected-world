"use client";

import { useState, useCallback } from "react";

interface TimelineSliderProps {
  minYear: number;
  maxYear: number;
  onChange: (year: number | null) => void;
}

export default function TimelineSlider({ minYear, maxYear, onChange }: TimelineSliderProps) {
  const [value, setValue] = useState(0);

  const totalSteps = maxYear - minYear + 1;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      setValue(v);
      if (v === 0) {
        onChange(null);
      } else {
        onChange(minYear + v - 1);
      }
    },
    [minYear, onChange]
  );

  const fillPercent = (value / totalSteps) * 100;
  const displayYear = value === 0 ? null : minYear + value - 1;

  return (
    <div style={{ width: "100%" }}>
      <div
        className="timeline-selected-year"
        style={{
          fontFamily: "var(--fh)",
          fontSize: "3.5rem",
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          marginBottom: "24px",
          letterSpacing: "0.02em",
          color: displayYear ? "var(--orange)" : "var(--text-l)",
          opacity: displayYear ? 1 : 0.6,
          minHeight: "3.5rem",
        }}
      >
        {displayYear ? displayYear : "All Eras"}
      </div>

      <div
        className="timeline-bar-container"
        style={{ position: "relative", padding: "0 0 32px" }}
      >
        <div
          className="timeline-track-fill"
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: "4px",
            width: `${fillPercent}%`,
            background: "var(--orange)",
            borderRadius: "2px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            marginTop: "-16px",
          }}
        />
        <input
          type="range"
          className="timeline-range"
          min={0}
          max={totalSteps}
          value={value}
          onChange={handleChange}
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            background: "transparent",
            cursor: "pointer",
            height: "4px",
            outline: "none",
          }}
        />
        <div
          className="timeline-labels"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.625rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--text-l)",
              opacity: 0.5,
            }}
          >
            {minYear}
          </span>
          <span
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.625rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--text-l)",
              opacity: 0.5,
            }}
          >
            {maxYear}
          </span>
        </div>
      </div>
    </div>
  );
}
