"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      setResolved(saved);
    } else {
      setTheme("system");
      document.documentElement.removeAttribute("data-theme");
      setResolved(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setResolved(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => {
    const next = resolved === "light" ? "dark" : "light";
    setTheme(next);
    setResolved(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${resolved === "light" ? "dark" : "light"} mode`}
      style={{
        fontFamily: "var(--font-chrome)",
        fontSize: "0.5625rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
        color: "var(--color-secondary)",
        background: "none",
        border: "1px solid var(--color-rule)",
        borderRadius: "2px",
        padding: "2px 8px",
        cursor: "pointer",
        transition: "color 150ms ease, border-color 150ms ease",
      }}
    >
      {resolved === "light" ? "dark" : "light"}
    </button>
  );
}
