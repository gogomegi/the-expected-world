import { notFound } from "next/navigation";
import { getEntriesByCategory, getCategoryBySlug, getAllCategories } from "@/lib/corpus";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return getAllCategories().map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const entries = getEntriesByCategory(slug);

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
        <div style={{ maxWidth: "var(--max-width-body)", margin: "0 auto", padding: "3rem 1.5rem 0" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", fontWeight: 400, color: "var(--color-text)", marginBottom: "1rem" }}>{category.name}</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", fontStyle: "italic", color: "var(--color-secondary)", marginBottom: "0.75rem", lineHeight: 1.6 }}>{category.description}</p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-secondary)", letterSpacing: "0.06em", marginBottom: "3rem" }}>{entries.length} entries</p>
        </div>

        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "0 2rem 6rem" }}>
          {entries.length === 0 ? (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-secondary)", padding: "3rem 0" }}>No passages indexed for this category yet. Submissions are open.</p>
          ) : entries.map((entry, idx) => (
            <Link key={entry.id} href={`/entry/${entry.id}`} style={{ display: "block" }}>
              <div className="cat-row" style={{ padding: "2rem 0", borderTop: "1px solid rgba(26,26,26,0.1)", borderBottom: idx === entries.length - 1 ? "1px solid rgba(26,26,26,0.1)" : "none", display: "flex", gap: "2rem" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="cat-quote" style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", fontStyle: "italic", lineHeight: 1.55, color: "var(--color-text)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.5rem", transition: "color 150ms ease" }}>{entry.quote}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)" }}>— {entry.author}</p>
                </div>
                <div className="cat-dates" style={{ flexShrink: 0, width: "16rem", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-accent)", textAlign: "right" }}>Predicted: <time dateTime={entry.predictedDateNormalized}>{entry.predictedDateNormalized}</time></p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-secondary)", textAlign: "right" }}>Written: <time dateTime={entry.dateWritten}>{entry.dateWritten}</time></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(26,26,26,0.12)", marginTop: "auto" }}>
        <div style={{ maxWidth: "var(--max-width-wide)", margin: "0 auto", padding: "5rem 2rem 3rem", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-secondary)" }}>
          <span>© The Expected World</span><span>Submissions &amp; Contact</span>
        </div>
      </footer>
      <style>{`.nav-link:hover{color:var(--color-text)!important;text-decoration:underline;text-underline-offset:3px}.cat-row:hover .cat-quote{color:var(--color-accent)!important}@media(max-width:768px){.cat-row{flex-direction:column!important;gap:.75rem!important}.cat-dates{width:auto!important;align-items:flex-start!important}.cat-dates p{text-align:left!important}}`}</style>
    </div>
  );
}
