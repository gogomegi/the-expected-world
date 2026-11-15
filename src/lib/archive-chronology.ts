/** The two chronological axes used to browse the public archive. */
export type ArchiveDateMode = "written" | "imagined";

export interface ArchiveDatedEntry {
  id: string;
  dateWritten: string;
  predictedDateNormalized: string;
}

/** Dates in the corpus have differing precision; use only the recorded year. */
export function getChronologyYear(entry: ArchiveDatedEntry, mode: ArchiveDateMode): number | null {
  const source = mode === "written" ? entry.dateWritten : entry.predictedDateNormalized;
  const match = source.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

/** Ascending chronological order, with unknown years placed last. */
export function sortChronologically<T extends ArchiveDatedEntry>(
  entries: readonly T[],
  mode: ArchiveDateMode
): T[] {
  return [...entries].sort((a, b) => {
    const yearA = getChronologyYear(a, mode) ?? Number.POSITIVE_INFINITY;
    const yearB = getChronologyYear(b, mode) ?? Number.POSITIVE_INFINITY;
    if (yearA !== yearB) return yearA - yearB;

    const dateA = mode === "written" ? a.dateWritten : a.predictedDateNormalized;
    const dateB = mode === "written" ? b.dateWritten : b.predictedDateNormalized;
    return dateA.localeCompare(dateB) || a.id.localeCompare(b.id);
  });
}
