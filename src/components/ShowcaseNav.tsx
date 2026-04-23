"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/timeline", label: "Archive" },
  { href: "/closing", label: "Closing" },
  { href: "/about", label: "About" },
  { href: "/submit", label: "Submit" },
];

export default function ShowcaseNav() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      className="showcase-nav"
      style={{
        position: "fixed",
        bottom: isMobile ? 100 : 64,
        right: isMobile ? 12 : 24,
        zIndex: 95,
      }}
    >
      {/* Expanded menu */}
      {open && (
        <div
          style={{
            background: "rgba(10,10,10,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "12px 0",
            marginBottom: 8,
            minWidth: 160,
          }}
        >
          <p
            style={{
              fontFamily: "var(--fm)",
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              padding: "4px 16px 8px",
            }}
          >
            Navigate
          </p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "8px 16px",
                fontFamily: "var(--fh)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                transition: "color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Site navigation"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          {open ? (
            <path d="M4 4L14 14M14 4L4 14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <>
              <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="9" cy="4" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="14" cy="4" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="4" cy="9" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="9" cy="9" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="14" cy="9" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="4" cy="14" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="9" cy="14" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="14" cy="14" r="1.5" fill="rgba(255,255,255,0.5)" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
