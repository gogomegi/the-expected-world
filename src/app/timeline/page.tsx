import { getEntriesByDecade, getAllEntries } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "All entries in The Expected World arranged by the date they predicted.",
};

export default function TimelinePage() {
  const byDecade = getEntriesByDecade();
  const total = getAllEntries().length;
  const decades = Object.keys(byDecade);

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
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "0 2rem 6rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 400, color: "var(--color-text)", paddingTop: "3rem", marginBottom: "0.75rem" }}>Timeline</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontStyle: "italic", color: "var(--color-secondary)", marginBottom: "3rem" }}>
            {total} entries arranged by the date they predicted.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem", borderBottom: "1px solid rgba(26,26,26,0.12)", paddingBottom: "1.5rem" }}>
            {decades.map(decade => (
              <a key={decade} href={`#${decade}`} className="decade-link" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, color: "var(--color-secondary)", letterSpacing: "0.06em", transition: "color 150ms ease" }}>{decade}</a>
            ))}
          </div>

          <div>
            {decades.map(decade => (
              <section key={decade} id={decade} style={{ marginBottom: "4rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500, color: "var(--color-accent)", letterSpacing: "0.05em" }}>{decade}</h2>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-secondary)" }}>{byDecade[decade].length} entries</span>
                  <div style={{ flex: 1, borderTop: "1px solid rgba(26,26,26,0.12)" }} />
                </div>

                {byDecade[decade].map((entry, idx) => (
                  <Link key={entry.id} href={`/entry/${entry.id}`} style={{ display: "block" }}>
                    <div className="timeline-row" style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", padding: "1.25rem 0", borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
                      <span style={{ flexShrink: 0, width: "4.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-accent)", paddingTop: "0.125rem" }}>
                        {entry.predictedDateNormalized.slice(0, 4)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="timeline-quote" style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontStyle: "italic", color: "var(--color-text)", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.375rem", transition: "color 150ms ease" }}>
                          {entry.quote}
                        </p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-secondary)" }}>{entry.author}</span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-secondary)" }}>{entry.category}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(26,26,26,0.12)", marginTop: "auto" }}>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "5rem 2rem 3rem", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
          <span>© The Expected World</span><span>Submissions &amp; Contact</span>
        </div>
      </footer>
      <style>{`.nav-link:hover{color:var(--color-text)!important;text-decoration:underline;text-underline-offset:3px}.decade-link:hover{color:var(--color-accent)!important}.timeline-row:hover .timeline-quote{color:var(--color-accent)!important}`}</style>
    </div>
  );
}
