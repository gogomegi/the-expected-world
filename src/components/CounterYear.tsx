"use client";

import { useRef, useEffect, useState } from "react";

interface CounterYearProps {
  year: number;
  className?: string;
  style?: React.CSSProperties;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function CounterYear({ year, className, style }: CounterYearProps) {
  const [display, setDisplay] = useState("0000");
  const elRef = useRef<HTMLSpanElement>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          observer.disconnect();

          const duration = 1200;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(eased * year);

            if (progress < 1) {
              setDisplay(String(current).padStart(4, "0"));
              requestAnimationFrame(tick);
            } else {
              setDisplay(String(year));
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [year]);

  return (
    <span
      ref={elRef}
      className={`counter-yr${className ? ` ${className}` : ""}`}
      style={style}
    >
      {display}
    </span>
  );
}
