import Link from "next/link";
import { CheckCircle, MinusCircle, XCircle, HelpCircle } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verdicts",
  description:
    "Browse predictions by accuracy: confirmed, busted, or still pending.",
};

const verdicts = [
  { slug: "confirmed", label: "Confirmed", description: "Predictions that came true", color: "text-sage border-sage/30", Icon: CheckCircle },
  { slug: "busted", label: "Busted", description: "Predictions that didn't come true", color: "text-crimson border-crimson/30", Icon: XCircle },
  { slug: "partial", label: "Partially True", description: "Predictions that were partly right", color: "text-ochre border-ochre/30", Icon: MinusCircle },
  { slug: "pending", label: "Pending", description: "Still waiting to find out", color: "text-steel border-steel/30", Icon: HelpCircle },
];

export default function VerdictsPage() {
  return (
    <>
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-12 max-md:px-4 py-16">
        <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-12">
          Browse by Verdict
        </h1>
        <div className="grid gap-6 sm:grid-cols-2">
          {verdicts.map((v) => (
            <Link
              key={v.slug}
              href={`/verdicts/${v.slug}`}
              className={`block bg-surface border border-divider rounded-lg p-8 hover:border-brass-muted hover:-translate-y-0.5 transition-all duration-200 ${v.color}`}
            >
              <v.Icon size={24} className="mb-3" />
              <h2 className="font-display font-semibold text-[24px] text-parchment mb-1">
                {v.label}
              </h2>
              <p className="text-dusk text-sm">{v.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
