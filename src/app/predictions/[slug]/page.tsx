import { getAllQuotes, getQuoteBySlug } from "@/lib/quotes";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VerdictBadge } from "@/components/VerdictBadge";
import { TopicPill } from "@/components/TopicPill";
import { MasonryCard } from "@/components/MasonryCard";
import { SiteHeader, SiteFooter } from "@/components/SiteLayout";
import { ExternalLink } from "lucide-react";

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

  const allQuotes = getAllQuotes();
  const related = allQuotes
    .filter(
      (q) =>
        q.slug !== quote.slug &&
        (q.categories.some((c) => quote.categories.includes(c)) ||
          Math.floor(q.yearWritten / 10) === Math.floor(quote.yearWritten / 10))
    )
    .slice(0, 3);

  const initials = quote.author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ink">
        {/* Hero area */}
        <div className="h-[50vh] relative flex items-end p-12 max-md:p-6 overflow-hidden">
          {quote.imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${quote.imageUrl}')`,
                filter: "brightness(0.25) saturate(0.5) contrast(1.15)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative z-[2] max-w-[800px]">
            <div className="font-mono text-[13px] tracking-[0.14em] uppercase text-dusk mb-5">
              <span>Written</span>{" "}
              <span className="text-parchment text-[15px]">{quote.yearWritten}</span>
              <span className="text-brass-muted mx-3">→</span>
              <span>Imagined</span>{" "}
              <span className="text-parchment text-[15px]">{quote.yearImagined}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[720px] mx-auto px-12 max-md:px-6 py-16">
          <blockquote className="font-quote text-[clamp(22px,3vw,36px)] leading-[1.45] mb-8">
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {/* Author block */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-divider">
            <div className="w-12 h-12 rounded-full bg-elevated border-2 border-brass-muted flex items-center justify-center font-display text-xl font-semibold text-brass">
              {initials}
            </div>
            <div>
              <Link
                href={`/author/${quote.authorSlug}`}
                className="font-body font-medium text-base text-brass hover:text-brass-bright transition-colors"
              >
                {quote.author}
              </Link>
              <div className="font-body font-light text-sm text-dusk italic">
                {quote.source}
                {quote.sourceUrl && (
                  <a
                    href={quote.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brass ml-2 hover:text-brass-bright"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Verdict */}
          {quote.didItHoldUp && (
            <div className="bg-surface border border-divider rounded-lg p-8 mb-10">
              <h3 className="font-display font-semibold text-2xl mb-4 flex items-center gap-3">
                <VerdictBadge verdict={quote.didItHoldUp.verdict} />
                The Verdict
              </h3>
              <p className="font-body font-light text-[15px] leading-[1.75] text-dusk">
                {quote.didItHoldUp.analysis}
              </p>
            </div>
          )}

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-8">
            {quote.categories.map((cat) => (
              <TopicPill key={cat} topic={cat} />
            ))}
          </div>

          {/* Share */}
          <div className="flex gap-4 items-center">
            <span className="font-body text-[13px] text-dusk">Share:</span>
            <span className="font-body text-[13px] text-brass cursor-pointer hover:text-brass-bright transition-colors">
              Twitter ↗
            </span>
            <span className="font-body text-[13px] text-brass cursor-pointer hover:text-brass-bright transition-colors">
              Copy link
            </span>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-12 max-md:px-6 py-16 border-t border-divider">
            <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-brass mb-8">
              More From The Archive
            </div>
            <div className="masonry">
              {related.map((q) => (
                <MasonryCard key={q.slug} quote={q} />
              ))}
            </div>
          </div>
        )}

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
      <SiteFooter />
    </>
  );
}
