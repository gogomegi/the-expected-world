"use client";

import { useRef, useEffect } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, delay, className }: ScrollRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayStyle: React.CSSProperties | undefined =
    delay !== undefined
      ? { transitionDelay: `${delay * 0.08}s` }
      : undefined;

  return (
    <div
      ref={elRef}
      className={`reveal${className ? ` ${className}` : ""}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
}
