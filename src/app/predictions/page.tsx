import { getAllQuotes } from "@/lib/quotes";
import { QuoteCard } from "@/components/QuoteCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Predictions — The Expected World",
  description:
    "Browse our full archive of historical predictions about the future. Filter by era, topic, or accuracy.",
};

export default function PredictionsPage() {
  const quotes = getAllQuotes();

  return (
    <main className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16">
      <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-12">
        All Predictions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map((q) => (
          <QuoteCard key={q.slug} quote={q} compact />
        ))}
      </div>
    </main>
  );
}
