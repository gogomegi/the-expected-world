import { getAllAuthors, getQuotesByAuthorSlug } from "@/lib/quotes";
import { MasonryCard } from "@/components/MasonryCard";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ author: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ author: string }>;
}): Promise<Metadata> {
  const { author } = await params;
  const a = getAllAuthors().find((x) => x.slug === author);
  if (!a) return { title: "Not Found" };
  return {
    title: `${a.name}'s Predictions`,
    description: `All predictions by ${a.name}. What did they foresee?`,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  const { author } = await params;
  const quotes = getQuotesByAuthorSlug(author);
  if (quotes.length === 0) notFound();

  return (
    <main className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16">
      <nav className="font-mono text-[11px] uppercase tracking-[0.06em] text-dusk mb-12">
        <Link href="/" className="hover:text-parchment transition-colors">Home</Link>
        {" / "}
        <span className="text-parchment">{quotes[0].author}</span>
      </nav>
      <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-12">
        {quotes[0].author}&apos;s Predictions
      </h1>
      <div className="masonry">
        {quotes.map((q) => (
          <MasonryCard key={q.slug} quote={q} />
        ))}
      </div>
    </main>
  );
}
