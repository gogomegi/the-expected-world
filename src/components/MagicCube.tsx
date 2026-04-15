"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface MagicCubeProps {
  years: { year: string; label: string }[];
}

const faceNames = ["front", "back", "right", "left", "top", "bottom"] as const;

export default function MagicCube({ years }: MagicCubeProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      ("ontouchstart" in window) || (navigator.maxTouchPoints > 0)
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isTouch || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current = {
        x: ((e.clientX - cx) / (rect.width / 2)) * 15,
        y: ((e.clientY - cy) / (rect.height / 2)) * -15,
        active: true,
      };
    },
    [isTouch]
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0, active: false };
  }, []);

  useEffect(() => {
    if (isTouch) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouch, handleMouseMove, handleMouseLeave]);

  useEffect(() => {
    const start = performance.now();
    const period = 28000;

    const animate = (now: number) => {
      if (!wrapRef.current) return;
      const elapsed = now - start;
      const progress = (elapsed % period) / period;
      const rotY = progress * 360;
      const rotX = Math.sin(progress * Math.PI * 2) * 12;
      const rotZ = Math.sin(progress * Math.PI * 4) * 3;

      const m = mouseRef.current;
      const mx = m.active ? m.x : 0;
      const my = m.active ? m.y : 0;

      wrapRef.current.style.transform =
        `rotateX(${rotX + my}deg) rotateY(${rotY + mx}deg) rotateZ(${rotZ}deg)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="cube-scene" ref={sceneRef}>
      <div className="cube-wrap" ref={wrapRef}>
        {faceNames.map((face, i) => {
          const item = years[i];
          if (!item) return null;
          return (
            <div key={face} className={`cube-face cube-face--${face}`}>
              <span className="cube-label">{item.label}</span>
              <span className="cube-year">{item.year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
