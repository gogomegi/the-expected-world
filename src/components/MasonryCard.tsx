import Link from "next/link";
import type { Quote } from "@/types/quote";

const verdictClass: Record<string, string> = {
  "came-true": "verdict-confirmed",
  "partially-true": "verdict-partial",
  "did-not-come-true": "verdict-busted",
  pending: "verdict-pending",
};

const verdictLabel: Record<string, string> = {
  "came-true": "✓ Confirmed",
  "partially-true": "~ Partially",
  "did-not-come-true": "✗ Busted",
  pending: "? Pending",
};

export function MasonryCard({
  quote,
  featured = false,
  imageUrl,
}: {
  quote: Quote;
  featured?: boolean;
  imageUrl?: string;
}) {
  return (
    <Link
      href={`/predictions/${quote.slug}`}
      className={`group masonry-item block bg-surface border border-divider rounded-md overflow-hidden cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-brass-muted hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 ${featured ? "bg-gradient-to-br from-surface to-[rgba(201,168,76,0.05)] border-brass-muted" : ""}`}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={quote.author}
          loading="lazy"
          className="w-full aspect-[16/10] object-cover saturate-[0.6] contrast-[1.05] hover:saturate-[0.8] transition-[filter] duration-[400ms]"
        />
      )}
      <div className={featured ? "p-7" : "p-5"}>
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-dusk mb-3">
          <span>Written</span>{" "}
          <span className="text-parchment">{quote.yearWritten}</span>
          <span className="text-brass-muted mx-1.5">→</span>
          <span>Imagined</span>{" "}
          <span className="text-parchment">{quote.yearImagined}</span>
        </div>

        <div className="relative mb-3.5">
          <div
            className={`font-quote leading-[1.5] line-clamp-4 ${featured ? "text-[22px] line-clamp-6" : "text-[17px]"}`}
          >
            &ldquo;{quote.text}&rdquo;
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-t from-surface to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center justify-between mt-3.5 mb-3.5">
          <div className="font-body font-medium text-[13px] text-brass">
            — {quote.author}
          </div>
          <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-brass-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Read&thinsp;→
          </span>
        </div>

        <div className="flex items-center gap-2">
          {quote.didItHoldUp && (
            <span
              className={`font-mono text-[9px] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-2xl ${verdictClass[quote.didItHoldUp.verdict]}`}
            >
              {verdictLabel[quote.didItHoldUp.verdict]}
            </span>
          )}
          {quote.categories.slice(0, 1).map((cat) => (
            <span
              key={cat}
              className="font-mono text-[9px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-2xl bg-elevated text-dusk border border-divider"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
