import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Get a daily prediction delivered to your inbox. Subscribe to The Expected World newsletter.",
};

export default function NewsletterPage() {
  return (
    <main className="max-w-[720px] mx-auto px-12 max-md:px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface border border-divider rounded-lg p-8 max-w-[540px] w-full text-center">
        <h1 className="font-display font-semibold text-[28px] tracking-[0.02em] mb-2">
          Tomorrow, Yesterday
        </h1>
        <p className="text-dusk font-light text-base leading-relaxed mb-8">
          A prediction from the past, delivered to your inbox.
        </p>

        <form className="flex gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="flex-1 h-11 bg-elevated border border-divider rounded px-4 text-parchment text-sm placeholder:text-graphite focus:outline-none focus:border-brass transition-colors"
          />
          <button
            type="submit"
            className="h-11 px-6 bg-brass text-deep-ink font-medium text-sm uppercase tracking-[0.04em] rounded hover:bg-brass-bright transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        <p className="text-graphite text-xs mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </main>
  );
}
