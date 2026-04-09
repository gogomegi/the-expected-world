import type { Quote } from "@/types/quote";
import { VerdictBadge } from "./VerdictBadge";

export function SplitSlide({
  quote,
  imageUrl,
  duotoneColor,
  highlightPhrase,
}: {
  quote: Quote;
  imageUrl: string;
  duotoneColor?: string;
  highlightPhrase?: string;
}) {
  let quoteContent: React.ReactNode;
  if (highlightPhrase && quote.text.includes(highlightPhrase)) {
    const parts = quote.text.split(highlightPhrase);
    quoteContent = (
      <>
        {parts[0]}
        <span style={{ color: duotoneColor || "var(--color-brass)" }}>
          {highlightPhrase}
        </span>
        {parts[1]}
      </>
    );
  } else {
    quoteContent = quote.text;
  }

  return (
    <section className="snap-section split-slide flex p-0 max-md:flex-col">
      <div className="split-image flex-1 relative overflow-hidden min-h-screen max-md:min-h-[40vh] max-md:flex-none">
        <div
          className="bg-image absolute inset-0 bg-cover bg-center saturate-50 contrast-[1.1]"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        {duotoneColor && (
          <div
            className="absolute inset-0 mix-blend-color"
            style={{ background: duotoneColor, opacity: 0.15 }}
          />
        )}
      </div>

      <div className="split-text flex-1 flex flex-col justify-center p-[clamp(32px,6vw,96px)] relative">
        <div className="font-mono text-xs tracking-[0.14em] uppercase text-dusk mb-8">
          <span>Written</span>{" "}
          <span className="text-parchment">{quote.yearWritten}</span>
          <span className="text-brass-muted mx-2.5">→</span>
          <span>Imagined</span>{" "}
          <span className="text-parchment">{quote.yearImagined}</span>
        </div>

        <div className="font-quote text-[clamp(22px,3.5vw,42px)] leading-[1.3] mb-8">
          &ldquo;{quoteContent}&rdquo;
        </div>

        <div className="mb-2">
          <span className="font-body font-medium text-base text-brass">
            {quote.author}
          </span>
        </div>
        <div className="font-body font-light text-sm text-dusk italic mb-7">
          {quote.source}, {quote.yearWritten}
        </div>

        {quote.didItHoldUp && (
          <>
            <VerdictBadge verdict={quote.didItHoldUp.verdict} />
            <div
              className="font-body font-light text-sm leading-[1.7] text-dusk mt-7 border-l-2 pl-5"
              style={{
                borderColor: duotoneColor
                  ? `${duotoneColor}66`
                  : "var(--color-brass-muted)",
              }}
            >
              {quote.didItHoldUp.analysis}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
