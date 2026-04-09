import Link from "next/link";
import { slugify } from "@/lib/quotes";

export function TopicPill({ topic }: { topic: string }) {
  return (
    <Link
      href={`/topic/${slugify(topic)}`}
      className="inline-block px-2.5 py-1 rounded-full bg-elevated border border-divider font-mono text-[10px] uppercase tracking-[0.06em] text-dusk hover:border-brass-muted hover:text-parchment hover:bg-[#2A2A42] transition-colors duration-200"
    >
      {topic}
    </Link>
  );
}
