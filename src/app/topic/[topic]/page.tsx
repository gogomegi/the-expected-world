import { getAllCategories, getQuotesByCategory, slugify } from "@/lib/quotes";
import { MasonryCard } from "@/components/MasonryCard";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ topic: slugify(cat) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const cat = getAllCategories().find((c) => slugify(c) === topic);
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat} Predictions`,
    description: `Historical predictions about ${cat.toLowerCase()}. What did people expect? Were they right?`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const cat = getAllCategories().find((c) => slugify(c) === topic);
  if (!cat) notFound();
  const quotes = getQuotesByCategory(topic);

  return (
    <main className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16">
      <nav className="font-mono text-[11px] uppercase tracking-[0.06em] text-dusk mb-12">
        <Link href="/" className="hover:text-parchment transition-colors">Home</Link>
        {" / "}
        <span className="text-parchment">{cat}</span>
      </nav>
      <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-12">
        {cat} Predictions
      </h1>
      <div className="masonry">
        {quotes.map((q) => (
          <MasonryCard key={q.slug} quote={q} />
        ))}
      </div>
    </main>
  );
}
