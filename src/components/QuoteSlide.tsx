import type { Quote } from "@/types/quote";
import { VerdictBadge } from "./VerdictBadge";

function getEraDecade(year: number): string {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

export function QuoteSlide({
  quote,
  imageUrl,
  highlightPhrase,
}: {
  quote: Quote;
  imageUrl?: string;
  highlightPhrase?: string;
}) {
  const era = getEraDecade(quote.yearWritten);

  // Split quote text to highlight a phrase
  let quoteContent: React.ReactNode;
  if (highlightPhrase && quote.text.includes(highlightPhrase)) {
    const parts = quote.text.split(highlightPhrase);
    quoteContent = (
      <>
        {parts[0]}
        <span className="text-brass">{highlightPhrase}</span>
        {parts[1]}
      </>
    );
  } else {
    quoteContent = quote.text;
  }

  return (
    <section
      className="snap-section quote-slide flex-col p-0"
      data-era={era}
    >
      {imageUrl && (
        <div
          className="bg-image absolute inset-0 bg-cover bg-center brightness-[0.3] contrast-[1.1] saturate-[0.6]"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
      )}
      <div className="bg-overlay absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink/[0.92] z-[1]" />

      <div className="quote-content relative z-[2] max-w-[900px] w-full px-12 max-md:px-6">
        <div className="timeline font-mono text-[clamp(10px,1.1vw,13px)] tracking-[0.14em] uppercase text-dusk mb-10">
          <span>Written</span>{" "}
          <span className="text-parchment">{quote.yearWritten}</span>
          <span className="text-brass-muted mx-2.5">→</span>
          <span>Imagined</span>{" "}
          <span className="text-parchment">{quote.yearImagined}</span>
        </div>

        <div className="quote-text-block font-quote text-[clamp(24px,4vw,52px)] leading-[1.25] tracking-[-0.01em] mb-10">
          &ldquo;{quoteContent}&rdquo;
        </div>

        <div className="attribution-block flex items-center gap-4">
          <div>
            <div className="font-body font-medium text-[clamp(14px,1.4vw,18px)] text-brass">
              {quote.author}
            </div>
            <div className="font-body font-light text-[clamp(12px,1vw,14px)] text-dusk italic">
              {quote.source}, {quote.yearWritten}
            </div>
          </div>
        </div>

        {quote.didItHoldUp && (
          <div className="verdict-block mt-8">
            <VerdictBadge verdict={quote.didItHoldUp.verdict} />
          </div>
        )}
      </div>

      {quote.didItHoldUp && (
        <div className="relative z-[2] max-w-[560px] px-12 max-md:px-6 mt-0">
          <div className="analysis-text font-body font-light text-[clamp(14px,1.2vw,17px)] leading-[1.75] text-dusk border-l-2 border-brass-muted pl-6">
            {quote.didItHoldUp.analysis}
          </div>
        </div>
      )}
    </section>
  );
}
