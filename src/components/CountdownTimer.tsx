"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setDisplay("arrived");
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setDisplay(`${d}d ${h}h ${m}m ${s}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span
      style={{
        fontFamily: "var(--fm)",
        fontSize: "0.6875rem",
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: "rgba(255,255,255,0.8)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {display}
    </span>
  );
}
