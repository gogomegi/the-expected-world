export function TimelineIndicator({
  yearWritten,
  yearImagined,
  centered = false,
}: {
  yearWritten: number;
  yearImagined: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`font-mono text-[11px] uppercase tracking-[0.12em] ${centered ? "text-center" : ""}`}
    >
      <span className="text-dusk">Written </span>
      <span className="text-parchment">{yearWritten}</span>
      <span className="text-brass-muted mx-2">→</span>
      <span className="text-dusk">Imagined </span>
      <span className="text-parchment">{yearImagined}</span>
    </div>
  );
}
