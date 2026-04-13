import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Expected World is an archival publication that surfaces texts originally written about the future.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Link href="/" style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", letterSpacing: "0.08em" }}>The Expected World</Link>
          <nav style={{ display: "flex", gap: "2rem" }}>
            {[["/", "browse"], ["/timeline", "timeline"], ["/about", "about"]].map(([href, label]) => (
              <Link key={href} href={href} className="nav-link" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)", letterSpacing: "0.04em", transition: "color 150ms ease" }}>{label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div style={{ maxWidth: "var(--max-width-body)", margin: "0 auto", padding: "0 1.5rem 6rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 400, color: "var(--color-text)", paddingTop: "3rem", marginBottom: "3rem" }}>About</h1>

          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", paddingTop: "0", marginBottom: "1rem" }}>What This Is</p>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem", lineHeight: 1.7, color: "var(--color-text)" }}>
            <p style={{ marginBottom: "1.25rem" }}>
              The Expected World is an archival publication that surfaces texts originally written about the future — predictions, forecasts, policy projections, fictional imaginings — each anchored to a specific date or period that has now elapsed.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              The site exists to create a particular kind of encounter: a reader meets a mind from the past speaking confidently, or anxiously, or hopefully, about a moment the reader has already lived through. The gap between expectation and outcome is the editorial territory.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              This is not a retro-futurism blog. We do not present the past as quaint or its predictions as fodder for amusement. A prediction is not interesting merely because it was wrong. It is interesting when the texture of the expectation — what was assumed, what was feared, what was considered obvious — reveals something about the mind that produced it, the era it emerged from, or the world we actually built.
            </p>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(26,26,26,0.12)", margin: "2.5rem 0 0" }} />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", paddingTop: "2.5rem", marginBottom: "1rem" }}>How Entries Are Selected</p>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem", lineHeight: 1.7, color: "var(--color-text)" }}>
            <p style={{ marginBottom: "1.25rem" }}>Every entry must satisfy four criteria. The source text must reference a specific future date, year, or bounded period. The predicted date must be in the past. The source must be verifiable. And the pairing of prediction and elapsed reality must reward attention.</p>
            <p style={{ marginBottom: "1.25rem" }}>The fourth criterion is the most important and the most subjective. Ask: does this entry surface a genuine surprise, a buried assumption, a forgotten anxiety, an uncanny accuracy, or a telling blind spot? If yes, it belongs. If it merely demonstrates that people in the past did not have perfect foresight, it does not.</p>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(26,26,26,0.12)", margin: "2.5rem 0 0" }} />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", paddingTop: "2.5rem", marginBottom: "1rem" }}>Editorial Standards</p>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem", lineHeight: 1.7, color: "var(--color-text)" }}>
            <p style={{ marginBottom: "1.25rem" }}>The voice of The Expected World is intellectual but not academic, concise but not glib. We write for readers who are curious, literate, and impatient with padding. Annotations provide context; they do not editorialize, moralize, or gloat. The governing question is always: would a thoughtful reader feel this was worth their attention?</p>
          </div>

          <div style={{ borderTop: "1px solid rgba(26,26,26,0.12)", padding: "3rem 0 0", marginTop: "2.5rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", color: "var(--color-secondary)", textTransform: "uppercase", marginBottom: "1rem" }}>Contact &amp; Submissions</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
              The archive grows through editorial judgment. If you have found a passage that meets our criteria, we would like to hear about it.
            </p>
            <a href="mailto:submissions@theexpectedworld.com" style={{ fontFamily: "var(--font-mono)", fontSize: "0.9375rem", color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              submissions@theexpectedworld.com
            </a>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(26,26,26,0.12)", marginTop: "auto" }}>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "5rem 2rem 3rem", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
          <span>© The Expected World</span><span>Submissions &amp; Contact</span>
        </div>
      </footer>
      <style>{`.nav-link:hover{color:var(--color-text)!important;text-decoration:underline;text-underline-offset:3px}`}</style>
    </div>
  );
}
