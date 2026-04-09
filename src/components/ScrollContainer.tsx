"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // IntersectionObserver for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.3, root: container }
    );

    container
      .querySelectorAll(".quote-slide, .split-slide")
      .forEach((el) => observer.observe(el));

    // Gallery stagger animation
    const galleryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const items = e.target.querySelectorAll(".masonry-item");
            items.forEach((item, i) => {
              const el = item as HTMLElement;
              el.style.opacity = "0";
              el.style.transform = "translateY(24px)";
              el.style.transition = `all 0.6s ease ${i * 0.08}s`;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.style.opacity = "1";
                  el.style.transform = "translateY(0)";
                });
              });
            });
            galleryObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, root: container }
    );

    container
      .querySelectorAll(".masonry")
      .forEach((el) => galleryObserver.observe(el));

    // Scroll handler for progress bar + parallax + floating nav
    const handleScroll = () => {
      const pct =
        (container.scrollTop /
          (container.scrollHeight - container.clientHeight)) *
        100;
      setProgress(pct);
      setShowNav(container.scrollTop > window.innerHeight * 0.5);

      // Parallax
      container
        .querySelectorAll<HTMLElement>(".quote-slide .bg-image, .single-hero .bg-image")
        .forEach((img) => {
          const rect = img.parentElement!.getBoundingClientRect();
          const offset = (rect.top / window.innerHeight) * 30;
          img.style.transform = `scale(1.05) translateY(${offset}px)`;
        });
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      galleryObserver.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-brass z-[1000] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />

      {/* Floating nav */}
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex gap-1 p-1 bg-ink/80 backdrop-blur-xl border border-divider rounded-full transition-opacity duration-400 max-md:hidden ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <a
          href="#opening"
          className="font-mono text-[10px] tracking-[0.08em] uppercase text-dusk px-3.5 py-1.5 rounded-full hover:text-parchment hover:bg-elevated transition-colors"
        >
          Home
        </a>
        <a
          href="#gallery"
          className="font-mono text-[10px] tracking-[0.08em] uppercase text-dusk px-3.5 py-1.5 rounded-full hover:text-parchment hover:bg-elevated transition-colors"
        >
          Archive
        </a>
        <a
          href="#newsletter"
          className="font-mono text-[10px] tracking-[0.08em] uppercase text-dusk px-3.5 py-1.5 rounded-full hover:text-parchment hover:bg-elevated transition-colors"
        >
          Subscribe
        </a>
      </nav>

      <div ref={containerRef} className="scroll-container" id="scrollContainer">
        {children}
      </div>
    </>
  );
}
