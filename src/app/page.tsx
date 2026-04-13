import { getFeaturedEntry, getRecentEntries } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Expected World — An archive of expired futures",
};

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function HomePage() {
  const featured = getFeaturedEntry();
  const recent = getRecentEntries(10);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Link href="/" style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", letterSpacing: "0.08em" }}>
            The Expected World
          </Link>
          <nav style={{ display: "flex", gap: "2rem" }}>
            {[["/#archive", "browse"], ["/timeline", "timeline"], ["/about", "about"]].map(([href, label]) => (
              <Link key={href} href={href} className="nav-link" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)", letterSpacing: "0.04em", transition: "color 150ms ease" }}>{label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Masthead */}
        <section style={{ maxWidth: "var(--max-width-body)", margin: "0 auto", padding: "5rem 1.5rem 3rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.75rem, 8vw, 4.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--color-text)", marginBottom: "1rem" }}>
            The Expected World
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem", fontStyle: "italic", color: "var(--color-secondary)", marginBottom: "3rem" }}>
            An archive of expired futures.
          </p>
          <hr style={{ border: "none", borderTop: "1px solid rgba(26,26,26,0.15)", width: "4rem", margin: "0 auto 3rem" }} />

          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, color: "var(--color-accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Today in the Expected Past — {todayLabel()}
          </p>

          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <Link href={`/entry/${featured.id}`} style={{ display: "block" }}>
              <div className="quote-block" style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
                <p className="featured-quote" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.375rem, 3vw, 2rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.5, color: "var(--color-text)", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 150ms ease" }}>
                  {featured.quote}
                </p>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-secondary)", marginBottom: "1rem", textAlign: "left" }}>
                — {featured.author}, <em>{featured.source.split(",")[0]}</em>{featured.dateWritten ? `, ${featured.dateWritten.slice(0, 4)}` : ""}
              </p>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-accent)", textAlign: "left", marginBottom: "2rem" }}>
                Written: <time dateTime={featured.dateWritten}>{featured.dateWritten}</time>
                <span style={{ color: "var(--color-secondary)", margin: "0 0.75rem" }}>·</span>
                Predicted: <time dateTime={featured.predictedDateNormalized}>{featured.predictedDateNormalized}</time>
              </div>
              <div style={{ textAlign: "left" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Read entry</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Entry list */}
        <section id="archive" style={{ maxWidth: "var(--max-width-body)", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <div style={{ borderTop: "1px solid rgba(26,26,26,0.12)", paddingTop: "4rem", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, color: "var(--color-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Recent &amp; Notable</p>
          </div>
          <div>
            {recent.filter(e => e.id !== featured.id).slice(0, 9).map((entry, idx, arr) => (
              <Link key={entry.id} href={`/entry/${entry.id}`} style={{ display: "block" }} className="entry-row-link">
                <article style={{ padding: "2rem 0", borderBottom: idx < arr.length - 1 ? "1px solid rgba(26,26,26,0.1)" : "none" }} className="entry-row">
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--color-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{entry.category}</p>
                  <p className="entry-quote" style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", fontWeight: 400, fontStyle: "italic", lineHeight: 1.55, color: "var(--color-text)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.75rem", transition: "color 150ms ease" }}>
                    {entry.quote}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-secondary)", marginBottom: "0.5rem" }}>— {entry.author}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-accent)" }}>
                    Predicted: {entry.predictedDateNormalized}{"   "}Written: {entry.dateWritten}
                  </p>
                </article>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "right", paddingTop: "2rem" }}>
            <Link href="/category/technology" style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Browse all entries</Link>
          </div>
        </section>

        <section style={{ maxWidth: "var(--max-width-body)", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-secondary)" }}>
            <Link href="/category/technology" className="browse-prompt-link">Browse by category →</Link>
            {"  ·  "}
            <Link href="/timeline" className="browse-prompt-link">Browse by era →</Link>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(26,26,26,0.12)", marginTop: "auto" }}>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "5rem 2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
          <span>© The Expected World</span>
          <span>Submissions &amp; Contact</span>
        </div>
      </footer>

      <style>{`
        .nav-link:hover { color: var(--color-text) !important; text-decoration: underline; text-underline-offset: 3px; }
        .entry-row-link:hover .entry-quote { color: var(--color-accent) !important; }
        .browse-prompt-link { color: var(--color-secondary); transition: color 150ms ease; }
        .browse-prompt-link:hover { color: var(--color-text) !important; }
      `}</style>
    </div>
  );
}
