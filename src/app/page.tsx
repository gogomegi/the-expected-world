import { getAllQuotes, getQuoteBySlug } from "@/lib/quotes";
import { ScrollContainer } from "@/components/ScrollContainer";
import { QuoteSlide } from "@/components/QuoteSlide";
import { SplitSlide } from "@/components/SplitSlide";
import { MasonryCard } from "@/components/MasonryCard";

// Curated homepage slides — hand-picked for impact
const heroSlides = [
  {
    slug: "tesla-wireless-energy-1926",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg",
    highlight: "huge brain.",
    layout: "full" as const,
  },
  {
    slug: "ehrlich-england-famine-1971",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/London_from_a_hot_air_balloon.jpg",
    highlight: "a small group of impoverished islands,",
    duotoneColor: "#B05454",
    layout: "split" as const,
  },
  {
    slug: "clarke-year-2100-internet-1964",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Golden_Gate_bridge_at_night.jpg",
    highlight: "The city is abolished.",
    layout: "full" as const,
  },
  {
    slug: "edison-alternating-current-1889",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Thomas_Edison2.jpg",
    highlight: "alternating current",
    layout: "full" as const,
  },
  {
    slug: "einstein-nuclear-energy-1934",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg",
    highlight: "not the slightest indication",
    layout: "full" as const,
  },
];

export default function Home() {
  const allQuotes = getAllQuotes();

  // Get curated quotes for slides
  const slides = heroSlides
    .map((s) => ({ ...s, quote: getQuoteBySlug(s.slug) }))
    .filter((s) => s.quote);

  // Gallery quotes (exclude hero quotes)
  const heroSlugs = new Set(heroSlides.map((s) => s.slug));
  const galleryQuotes = allQuotes.filter((q) => !heroSlugs.has(q.slug));

  return (
    <ScrollContainer>
      {/* Opening */}
      <section className="snap-section flex-col bg-ink" id="opening">
        <div
          className="font-display font-semibold text-[clamp(24px,5vw,56px)] tracking-[0.35em] uppercase text-parchment text-center opacity-0"
          style={{ animation: "fadeUp 1.2s ease 0.3s forwards" }}
        >
          The Expected World
        </div>
        <div
          className="font-mono text-[clamp(10px,1.2vw,14px)] tracking-[0.2em] uppercase text-dusk mt-5 opacity-0"
          style={{ animation: "fadeUp 1.2s ease 0.8s forwards" }}
        >
          The future, as they saw it
        </div>
        <div
          className="w-px h-0 bg-brass-muted mt-12"
          style={{ animation: "growLine 2s ease 1.4s forwards" }}
        />
        <div
          className="font-mono text-[10px] tracking-[0.15em] uppercase text-graphite mt-8 opacity-0"
          style={{ animation: "fadeUp 1s ease 2.2s forwards" }}
        >
          Scroll to begin
        </div>
      </section>

      {/* Quote Slides with interstitials */}
      {slides.map((s, i) => (
        <div key={s.slug}>
          {s.layout === "split" ? (
            <SplitSlide
              quote={s.quote!}
              imageUrl={s.imageUrl}
              duotoneColor={s.duotoneColor}
              highlightPhrase={s.highlight}
            />
          ) : (
            <QuoteSlide
              quote={s.quote!}
              imageUrl={s.imageUrl}
              highlightPhrase={s.highlight}
            />
          )}

          {/* Interstitials after first two slides */}
          {i === 0 && (
            <section className="snap-section flex-col gap-2 bg-ink min-h-[40vh]">
              <div className="font-display font-semibold text-[clamp(20px,3vw,40px)] tracking-[0.04em] text-parchment text-center max-w-[600px] leading-[1.3]">
                Every era imagines<br />what comes next.
              </div>
              <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-brass mt-4">
                Some get it right.
              </div>
            </section>
          )}
          {i === 1 && (
            <section className="snap-section flex-col gap-2 bg-ink min-h-[40vh]">
              <div className="font-display font-semibold text-[clamp(20px,3vw,40px)] tracking-[0.04em] text-parchment text-center max-w-[600px] leading-[1.3]">
                Some don&apos;t.
              </div>
              <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-brass mt-4">
                But they all tell us something.
              </div>
            </section>
          )}
        </div>
      ))}

      {/* Gallery / Archive */}
      <section
        className="min-h-screen p-24 max-md:p-6 bg-ink block"
        id="gallery"
      >
        <div className="text-center mb-16">
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-brass mb-3">
            The Archive
          </div>
          <h2 className="font-display font-semibold text-[clamp(28px,4vw,48px)] tracking-[0.03em]">
            Every Era Imagines What Comes Next
          </h2>
          <p className="font-body font-light text-base text-dusk mt-3">
            {allQuotes.length} predictions and counting
          </p>
        </div>

        <div className="masonry">
          {galleryQuotes.slice(0, 12).map((q, i) => (
            <MasonryCard key={q.slug} quote={q} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section
        className="min-h-[60vh] snap-section flex flex-col items-center justify-center p-24 max-md:p-6 text-center bg-gradient-to-b from-ink to-surface"
        id="newsletter"
      >
        <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-brass mb-6">
          Tomorrow, Yesterday
        </div>
        <h2 className="font-display font-semibold text-[clamp(28px,4vw,48px)] mb-2">
          A prediction from the past,<br />delivered to your inbox.
        </h2>
        <div className="font-body font-light text-lg text-dusk mb-10 max-w-[480px]">
          One extraordinary prediction every morning. Free forever.
        </div>
        <form className="flex gap-2 max-w-[440px] w-full max-md:flex-col">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 h-[52px] bg-elevated border border-divider rounded px-5 font-body text-[15px] text-parchment placeholder:text-graphite focus:outline-none focus:border-brass transition-colors"
          />
          <button
            type="submit"
            className="h-[52px] px-7 bg-brass text-ink border-none rounded font-body font-medium text-sm uppercase tracking-[0.06em] cursor-pointer hover:bg-brass-bright transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-graphite mt-4">
          Join 1,200 time-travelers. No spam, ever.
        </p>
      </section>

      {/* Footer */}
      <footer className="p-12 text-center border-t border-divider">
        <div className="font-display font-semibold text-sm tracking-[0.25em] uppercase text-dusk mb-6">
          The Expected World
        </div>
        <nav className="flex gap-6 justify-center mb-6">
          <a href="/predictions" className="font-body text-[13px] text-graphite hover:text-parchment transition-colors">
            Archive
          </a>
          <a href="/about" className="font-body text-[13px] text-graphite hover:text-parchment transition-colors">
            About
          </a>
          <a href="/submit" className="font-body text-[13px] text-graphite hover:text-parchment transition-colors">
            Submit
          </a>
          <a href="/newsletter" className="font-body text-[13px] text-graphite hover:text-parchment transition-colors">
            Newsletter
          </a>
        </nav>
        <div className="font-body text-[11px] text-graphite">
          &copy; 2026 The Expected World. A project by Expected Worlds.
        </div>
      </footer>
    </ScrollContainer>
  );
}
