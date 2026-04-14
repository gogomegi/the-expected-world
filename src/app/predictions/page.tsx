import { getAllQuotes } from "@/lib/quotes";
import { getArchiveOrder } from "@/lib/ordering";
import { MasonryCard } from "@/components/MasonryCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Archive — The Expected World",
  description:
    "Browse our full archive of historical predictions about the future.",
};

export const dynamic = "force-dynamic";

export default function PredictionsPage() {
  const allQuotes = getAllQuotes();
  const archiveOrder = getArchiveOrder();

  // Sort: ordered quotes first, then remaining by yearWritten
  let quotes;
  if (archiveOrder.length > 0) {
    const ordered = archiveOrder
      .map((slug) => allQuotes.find((q) => q.slug === slug))
      .filter(Boolean) as typeof allQuotes;
    const orderedSlugs = new Set(archiveOrder);
    const rest = allQuotes
      .filter((q) => !orderedSlugs.has(q.slug))
      .sort((a, b) => a.yearWritten - b.yearWritten);
    quotes = [...ordered, ...rest];
  } else {
    quotes = allQuotes;
  }

  return (
    <main className="min-h-screen p-24 max-md:p-6 bg-ink">
      <div className="text-center mb-16">
        <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-brass mb-3">
          The Archive
        </div>
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,48px)] tracking-[0.03em]">
          Every Era Imagines What Comes Next
        </h1>
        <p className="font-body font-light text-base text-dusk mt-3">
          {quotes.length} predictions and counting
        </p>
      </div>

      <div className="masonry">
        {quotes.map((q, i) => (
          <MasonryCard key={q.slug} quote={q} featured={i === 0} />
        ))}
      </div>
    </main>
  );
}
