"use client";

import { useRef, useEffect, useCallback } from "react";

interface MagicCubeProps {
  years: { year: string; label: string }[];
}

const faceNames = ["front", "back", "right", "left", "top", "bottom"] as const;

export default function MagicCube({ years }: MagicCubeProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0, dragX: 0, dragY: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current = {
        x: ((e.clientX - cx) / (rect.width / 2)) * 15,
        y: ((e.clientY - cy) / (rect.height / 2)) * -15,
        active: true,
      };
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0, active: false };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Touch drag support
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      dragRef.current.active = true;
      dragRef.current.startX = t.clientX;
      dragRef.current.startY = t.clientY;
      dragRef.current.offsetX = dragRef.current.dragX;
      dragRef.current.offsetY = dragRef.current.dragY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.active) return;
      e.preventDefault();
      const t = e.touches[0];
      dragRef.current.dragX = dragRef.current.offsetX + (t.clientX - dragRef.current.startX) * 0.5;
      dragRef.current.dragY = dragRef.current.offsetY + (t.clientY - dragRef.current.startY) * -0.5;
    };

    const onTouchEnd = () => {
      dragRef.current.active = false;
    };

    scene.addEventListener("touchstart", onTouchStart, { passive: true });
    scene.addEventListener("touchmove", onTouchMove, { passive: false });
    scene.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      scene.removeEventListener("touchstart", onTouchStart);
      scene.removeEventListener("touchmove", onTouchMove);
      scene.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

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

      const d = dragRef.current;

      wrapRef.current.style.transform =
        `rotateX(${rotX + my + d.dragY}deg) rotateY(${rotY + mx + d.dragX}deg) rotateZ(${rotZ}deg)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="cube-scene" ref={sceneRef} style={{ touchAction: "none" }}>
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
