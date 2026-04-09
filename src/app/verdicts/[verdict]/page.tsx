import { getQuotesByVerdict } from "@/lib/quotes";
import { QuoteCard } from "@/components/QuoteCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const verdictMap: Record<string, { label: string; filter: string }> = {
  confirmed: { label: "Confirmed", filter: "came-true" },
  busted: { label: "Busted", filter: "did-not-come-true" },
  partial: { label: "Partially True", filter: "partially-true" },
  pending: { label: "Pending", filter: "pending" },
};

export function generateStaticParams() {
  return Object.keys(verdictMap).map((verdict) => ({ verdict }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ verdict: string }>;
}): Promise<Metadata> {
  const { verdict } = await params;
  const info = verdictMap[verdict];
  if (!info) return { title: "Not Found" };
  return {
    title: `${info.label} Predictions`,
    description: `Predictions that were ${info.label.toLowerCase()}.`,
  };
}

export default async function VerdictPage({
  params,
}: {
  params: Promise<{ verdict: string }>;
}) {
  const { verdict } = await params;
  const info = verdictMap[verdict];
  if (!info) notFound();

  const quotes = getQuotesByVerdict(info.filter);

  return (
    <main className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16">
      <nav className="font-mono text-[11px] uppercase tracking-[0.06em] text-dusk mb-12">
        <Link href="/" className="hover:text-parchment transition-colors">Home</Link>
        {" / "}
        <Link href="/verdicts" className="hover:text-parchment transition-colors">Verdicts</Link>
        {" / "}
        <span className="text-parchment">{info.label}</span>
      </nav>

      <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-12">
        {info.label} Predictions
      </h1>

      {quotes.length === 0 ? (
        <p className="text-dusk italic">No predictions matched. Perhaps they haven&apos;t been written yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <QuoteCard key={q.slug} quote={q} compact />
          ))}
        </div>
      )}
    </main>
  );
}
