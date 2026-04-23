"use client";

import { useState, useEffect } from "react";

interface BottomBarProps {
  closedCount: number;
}

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function BottomBar({ closedCount }: BottomBarProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
      setDate(`${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bottom-bar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
            color: "var(--text-d)",
            letterSpacing: "0.04em",
          }}
        >
          {time}
        </span>
        <span
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted-d)",
          }}
        >
          {date}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--fm)",
            fontSize: "0.5625rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-d)",
          }}
        >
          Cases closed
        </span>
        <span
          style={{
            fontFamily: "var(--fh)",
            fontSize: "1.125rem",
            fontWeight: 900,
            color: "var(--orange)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {closedCount}
        </span>
      </div>
    </div>
  );
}
