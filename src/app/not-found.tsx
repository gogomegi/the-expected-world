import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="max-w-[720px] mx-auto px-12 max-md:px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] mb-4">
        This page was predicted but never arrived.
      </h1>
      <p className="text-dusk mb-8">
        Perhaps it&apos;s still in the future.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-brass font-medium text-sm hover:text-brass-bright hover:underline transition-colors"
      >
        Back to the archive <ArrowRight size={16} />
      </Link>
    </main>
  );
}
