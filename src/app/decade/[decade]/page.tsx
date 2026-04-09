import { getAllDecades, getQuotesByDecade } from "@/lib/quotes";
import { MasonryCard } from "@/components/MasonryCard";
import { SiteHeader, SiteFooter } from "@/components/SiteLayout";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllDecades().map((d) => ({ decade: d }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ decade: string }>;
}): Promise<Metadata> {
  const { decade } = await params;
  return {
    title: `${decade} Predictions`,
    description: `What did people predict during the ${decade}? Browse historical predictions from this era.`,
  };
}

export default async function DecadePage({
  params,
}: {
  params: Promise<{ decade: string }>;
}) {
  const { decade } = await params;
  const quotes = getQuotesByDecade(decade);
  if (quotes.length === 0) notFound();

  return (
    <>
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16">
        <nav className="font-mono text-[11px] uppercase tracking-[0.06em] text-dusk mb-12">
          <Link href="/" className="hover:text-parchment transition-colors">Home</Link>
          {" / "}
          <span className="text-parchment">{decade}</span>
        </nav>
        <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-12">
          Predictions from the {decade}
        </h1>
        <div className="masonry">
          {quotes.map((q) => (
            <MasonryCard key={q.slug} quote={q} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
