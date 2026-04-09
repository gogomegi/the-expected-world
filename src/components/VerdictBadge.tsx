import { CheckCircle, MinusCircle, XCircle, HelpCircle } from "lucide-react";
import type { Verdict } from "@/types/quote";

const config: Record<
  Verdict,
  { label: string; color: string; bg: string; border: string; Icon: typeof CheckCircle }
> = {
  "came-true": {
    label: "Confirmed",
    color: "text-sage",
    bg: "bg-sage/12",
    border: "border-sage/30",
    Icon: CheckCircle,
  },
  "partially-true": {
    label: "Partially True",
    color: "text-ochre",
    bg: "bg-ochre/12",
    border: "border-ochre/30",
    Icon: MinusCircle,
  },
  "did-not-come-true": {
    label: "Busted",
    color: "text-crimson",
    bg: "bg-crimson/12",
    border: "border-crimson/30",
    Icon: XCircle,
  },
  pending: {
    label: "Pending",
    color: "text-steel",
    bg: "bg-steel/12",
    border: "border-steel/30",
    Icon: HelpCircle,
  },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const c = config[verdict];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.08em] ${c.color} ${c.bg} ${c.border}`}
    >
      <c.Icon size={14} />
      {c.label}
    </span>
  );
}
