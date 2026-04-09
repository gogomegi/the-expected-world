import { getAllQuotes, getQuoteBySlug, slugify } from "@/lib/quotes";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VerdictBadge } from "@/components/VerdictBadge";
import { TopicPill } from "@/components/TopicPill";
import { QuoteCard } from "@/components/QuoteCard";
import { ExternalLink, Share2 } from "lucide-react";

export async function generateStaticParams() {
  return getAllQuotes().map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quote = getQuoteBySlug(slug);
  if (!quote) return { title: "Not Found" };

  const description = `"${quote.text.slice(0, 100)}..." — Did it hold up? ${quote.didItHoldUp ? quote.didItHoldUp.verdict.replace(/-/g, " ") : "Pending"}.`;

  return {
    title: `${quote.author}'s ${quote.yearWritten} Prediction`,
    description,
    openGraph: {
      title: `${quote.author} predicted this in ${quote.yearWritten}...`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${quote.author} predicted this in ${quote.yearWritten}...`,
      description,
    },
  };
}

export default async function PredictionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quote = getQuoteBySlug(slug);
  if (!quote) notFound();

  // Find related quotes (same categories or decade)
  const allQuotes = getAllQuotes();
  const related = allQuotes
    .filter(
      (q) =>
        q.slug !== quote.slug &&
        (q.categories.some((c) => quote.categories.includes(c)) ||
          Math.floor(q.yearWritten / 10) ===
            Math.floor(quote.yearWritten / 10))
    )
    .slice(0, 3);

  return (
    <main>
      <div className="max-w-[720px] mx-auto px-12 max-md:px-4 py-16">
        {/* Breadcrumb */}
        <nav className="font-mono text-[11px] uppercase tracking-[0.06em] text-dusk mb-12">
          <Link href="/" className="hover:text-parchment transition-colors">
            Home
          </Link>
          {" / "}
          <Link
            href="/predictions"
            className="hover:text-parchment transition-colors"
          >
            Predictions
          </Link>
          {" / "}
          <span className="text-parchment">{quote.author}</span>
        </nav>

        {/* Expanded Timeline */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-8 max-md:gap-4">
            <div>
              <div className="w-10 h-px bg-divider mx-auto mb-2" />
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dusk mb-1">
                Written
              </p>
              <p className="font-display font-semibold text-[32px] text-parchment">
                {quote.yearWritten}
              </p>
              <p className="text-dusk text-[13px] font-light">
                {quote.author}
              </p>
            </div>
            <span className="text-brass-muted text-2xl mt-4">→</span>
            <div>
              <div className="w-10 h-px bg-divider mx-auto mb-2" />
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dusk mb-1">
                Imagined
              </p>
              <p className="font-display font-semibold text-[32px] text-parchment">
                {quote.yearImagined}
              </p>
              <p className="text-dusk text-[13px] font-light">
                {Number(quote.yearImagined) - quote.yearWritten > 0
                  ? `${Number(quote.yearImagined) - quote.yearWritten} years later`
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Quote — centered on individual page (no left border per Vera) */}
        <blockquote className="font-quote text-[26px] max-md:text-[20px] leading-[1.65] text-parchment text-center max-w-[720px] mb-8">
          &ldquo;{quote.text}&rdquo;
        </blockquote>

        {/* Attribution */}
        <div className="text-center mb-8">
          <p className="text-brass font-medium">
            —{" "}
            <Link
              href={`/author/${quote.authorSlug}`}
              className="underline underline-offset-4 hover:text-brass-bright transition-colors"
            >
              {quote.author}
            </Link>
          </p>
          <p className="text-dusk text-[13px] italic mt-1">
            {quote.source}
            {quote.sourceUrl && (
              <a
                href={quote.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brass ml-2 hover:text-brass-bright"
              >
                View original source <ExternalLink size={12} />
              </a>
            )}
          </p>
        </div>

        {/* Verdict */}
        {quote.didItHoldUp && (
          <section className="text-center mb-8">
            <div className="mb-4">
              <VerdictBadge verdict={quote.didItHoldUp.verdict} />
            </div>
            <p className="text-parchment/80 leading-relaxed max-w-[720px] mx-auto">
              {quote.didItHoldUp.analysis}
            </p>
          </section>
        )}

        {/* Topics */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {quote.categories.map((cat) => (
            <TopicPill key={cat} topic={cat} />
          ))}
        </div>

        {/* Share */}
        <div className="flex justify-center gap-3 text-dusk text-sm mb-8">
          <span className="inline-flex items-center gap-1.5 hover:text-brass transition-colors cursor-pointer">
            <Share2 size={14} /> Share
          </span>
        </div>
      </div>

      {/* Related Predictions */}
      {related.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16 border-t border-divider">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass mb-3">
            More From The Archive
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((q) => (
              <QuoteCard key={q.slug} quote={q} compact />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16 flex justify-center">
        <div className="bg-surface border border-divider rounded-lg p-8 max-w-[540px] w-full text-center">
          <h2 className="font-display font-semibold text-[28px] tracking-[0.02em] mb-2">
            Tomorrow, Yesterday
          </h2>
          <p className="text-dusk font-light text-base leading-relaxed mb-8">
            A prediction from the past, delivered to your inbox.
          </p>
          <form className="flex gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 h-11 bg-elevated border border-divider rounded px-4 text-parchment text-sm placeholder:text-graphite focus:outline-none focus:border-brass transition-colors"
            />
            <button
              type="submit"
              className="h-11 px-6 bg-brass text-deep-ink font-medium text-sm uppercase tracking-[0.04em] rounded hover:bg-brass-bright transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-graphite text-xs mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quotation",
            text: quote.text,
            author: { "@type": "Person", name: quote.author },
            dateCreated: String(quote.yearWritten),
            about: { "@type": "Thing", name: quote.categories.join(", ") },
            isPartOf: {
              "@type": "WebSite",
              name: "The Expected World",
              url: "https://theexpectedworld.com",
            },
          }),
        }}
      />
    </main>
  );
}
