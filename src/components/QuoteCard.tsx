import Link from "next/link";
import type { Quote } from "@/types/quote";
import { VerdictBadge } from "./VerdictBadge";
import { TopicPill } from "./TopicPill";
import { TimelineIndicator } from "./TimelineIndicator";

export function QuoteCard({
  quote,
  compact = false,
}: {
  quote: Quote;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/predictions/${quote.slug}`}
      className={`block bg-surface border border-divider rounded-lg hover:border-brass-muted hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 ${compact ? "p-4" : "p-6 md:p-8"}`}
    >
      <TimelineIndicator
        yearWritten={quote.yearWritten}
        yearImagined={quote.yearImagined}
      />

      <blockquote
        className={`font-quote text-parchment leading-[1.65] mt-4 ${compact ? "text-[17px] line-clamp-3" : "text-[22px] max-md:text-[19px]"}`}
      >
        &ldquo;{quote.text}&rdquo;
      </blockquote>

      <div className="mt-4">
        <p className="text-brass text-sm font-medium">— {quote.author}</p>
        <p className="text-dusk text-[13px] italic">{quote.source}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {quote.didItHoldUp && (
          <VerdictBadge verdict={quote.didItHoldUp.verdict} />
        )}
        {quote.categories.map((cat) => (
          <TopicPill key={cat} topic={cat} />
        ))}
      </div>
    </Link>
  );
}
