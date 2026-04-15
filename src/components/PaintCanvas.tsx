"use client";

import { useRef, useEffect, useState } from "react";

const COLORS = ["#E8652A", "#2B5CE6", "#1A8C54", "#D4952B", "#7B3FBF"];

interface Blob {
  x: number;
  y: number;
  baseR: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  phase: number;
}

export default function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const isTouch =
      ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    const isSmall = window.innerWidth < 640;
    if (isTouch || isSmall) {
      setDisabled(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Init blobs
    blobsRef.current = Array.from({ length: 6 }, () => {
      const baseR = 60 + Math.random() * 120;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseR,
        r: baseR,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      };
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now() / 1000;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const blob of blobsRef.current) {
        // Breathing
        blob.r = blob.baseR + Math.sin(now * 1.2 + blob.phase) * 15;

        // Mouse repulsion
        const dx = blob.x - mx;
        const dy = blob.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 && dist > 0) {
          const force = (300 - dist) / 300 * 2;
          blob.vx += (dx / dist) * force * 0.05;
          blob.vy += (dy / dist) * force * 0.05;
        }

        // Drift
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Dampen
        blob.vx *= 0.995;
        blob.vy *= 0.995;

        // Wrap
        if (blob.x < -blob.r) blob.x = canvas.width + blob.r;
        if (blob.x > canvas.width + blob.r) blob.x = -blob.r;
        if (blob.y < -blob.r) blob.y = canvas.height + blob.r;
        if (blob.y > canvas.height + blob.r) blob.y = -blob.r;

        // Draw
        const grad = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.r
        );
        const opacity = 0.06 + Math.random() * 0.03;
        grad.addColorStop(0, blob.color + Math.round(opacity * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(1, blob.color + "00");

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
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
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
