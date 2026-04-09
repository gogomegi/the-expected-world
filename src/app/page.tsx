import {
  getDailyQuote,
  getAllCategories,
  getAllDecades,
  getAllQuotes,
  slugify,
} from "@/lib/quotes";
import Link from "next/link";
import { VerdictBadge } from "@/components/VerdictBadge";
import { TopicPill } from "@/components/TopicPill";
import { TimelineIndicator } from "@/components/TimelineIndicator";
import { QuoteCard } from "@/components/QuoteCard";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const daily = getDailyQuote();
  const decades = getAllDecades();
  const allQuotes = getAllQuotes();
  const recentQuotes = allQuotes.slice(0, 6);

  const confirmedCount = allQuotes.filter(
    (q) => q.didItHoldUp?.verdict === "came-true"
  ).length;
  const partialCount = allQuotes.filter(
    (q) => q.didItHoldUp?.verdict === "partially-true"
  ).length;
  const bustedCount = allQuotes.filter(
    (q) => q.didItHoldUp?.verdict === "did-not-come-true"
  ).length;

  return (
    <main>
      {/* Hero: Daily Quote */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-12 max-md:px-6 py-24 max-md:py-16 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.03)_0%,transparent_70%)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass mb-6">
          Today&apos;s Prediction
        </p>

        <TimelineIndicator
          yearWritten={daily.yearWritten}
          yearImagined={daily.yearImagined}
          centered
        />

        <blockquote className="font-quote text-[26px] max-md:text-[20px] leading-[1.65] text-parchment max-w-[720px] mt-6">
          &ldquo;{daily.text}&rdquo;
        </blockquote>

        <p className="text-brass font-medium text-sm mt-6">— {daily.author}</p>
        <p className="text-dusk text-[13px] italic">{daily.source}</p>

        {daily.didItHoldUp && (
          <div className="mt-6">
            <VerdictBadge verdict={daily.didItHoldUp.verdict} />
          </div>
        )}

        <Link
          href={`/predictions/${daily.slug}`}
          className="inline-flex items-center gap-2 text-brass font-medium text-sm mt-8 hover:text-brass-bright hover:underline transition-colors duration-200"
        >
          Read the full story <ArrowRight size={16} />
        </Link>
      </section>

      {/* Explore the Archive */}
      <section className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-24 max-md:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass mb-3">
          Explore
        </p>
        <h2 className="font-display font-semibold text-[24px] tracking-[0.02em] mb-8">
          Explore the Archive
        </h2>

        {/* Decade pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 [mask-image:linear-gradient(to_right,black_90%,transparent)]">
          {decades.map((decade) => (
            <Link
              key={decade}
              href={`/decade/${decade}`}
              className="shrink-0 inline-block px-2.5 py-1 rounded-full bg-elevated border border-divider font-mono text-[10px] uppercase tracking-[0.06em] text-dusk hover:border-brass-muted hover:text-parchment transition-colors duration-200"
            >
              {decade}
            </Link>
          ))}
        </div>

        {/* Recent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentQuotes.map((q) => (
            <QuoteCard key={q.slug} quote={q} compact />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/predictions"
            className="inline-flex items-center gap-2 text-brass font-medium text-sm hover:text-brass-bright hover:underline transition-colors duration-200"
          >
            Browse all predictions <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Verdicts at a Glance */}
      <section className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-24 max-md:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass mb-3">
          Verdicts
        </p>
        <h2 className="font-display font-semibold text-[24px] tracking-[0.02em] mb-8">
          Verdicts at a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/verdicts/confirmed"
            className="block bg-surface border border-divider rounded-lg p-6 text-center hover:border-brass-muted hover:-translate-y-0.5 transition-all duration-200"
          >
            <p className="font-display font-semibold text-[40px] text-sage">
              {confirmedCount}
            </p>
            <p className="text-sm text-dusk">Confirmed</p>
          </Link>
          <Link
            href="/verdicts/partial"
            className="block bg-surface border border-divider rounded-lg p-6 text-center hover:border-brass-muted hover:-translate-y-0.5 transition-all duration-200"
          >
            <p className="font-display font-semibold text-[40px] text-ochre">
              {partialCount}
            </p>
            <p className="text-sm text-dusk">Partially True</p>
          </Link>
          <Link
            href="/verdicts/busted"
            className="block bg-surface border border-divider rounded-lg p-6 text-center hover:border-brass-muted hover:-translate-y-0.5 transition-all duration-200"
          >
            <p className="font-display font-semibold text-[40px] text-crimson">
              {bustedCount}
            </p>
            <p className="text-sm text-dusk">Busted</p>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-24 max-md:py-16 flex justify-center">
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
    </main>
  );
}
