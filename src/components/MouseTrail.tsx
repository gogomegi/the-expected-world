"use client";

import { useRef, useEffect, useState } from "react";

const COLORS = ["#E8652A", "#2B5CE6", "#1A8C54", "#D4952B", "#7B3FBF"];

interface Dot {
  x: number;
  y: number;
  r: number;
  life: number;
  color: string;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const lastAddRef = useRef<number>(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (("ontouchstart" in window) || (navigator.maxTouchPoints > 0)) {
      setIsTouch(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastAddRef.current < 40) return;
      lastAddRef.current = now;

      dotsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 4 + Math.random() * 8,
        life: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dotsRef.current = dotsRef.current.filter((dot) => dot.life > 0);

      for (const dot of dotsRef.current) {
        dot.life -= 0.015;
        dot.r += 0.15;

        if (dot.life <= 0) continue;

        const opacity = dot.life * 0.2;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = dot.color + Math.round(opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      id="mouse-canvas"
    />
  );
}
