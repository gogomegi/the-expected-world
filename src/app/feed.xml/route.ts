import { getArchiveEntries, getClosingEntries, displayYear, isExpired } from "@/lib/corpus";

const SITE_URL = "https://theexpectedworld.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const entries = [...getArchiveEntries(), ...getClosingEntries()]
    .sort((a, b) => b.predictedDateNormalized.localeCompare(a.predictedDateNormalized))
    .slice(0, 50);

  const items = entries.map((entry) => {
    const year = displayYear(entry);
    const label = isExpired(entry.predictedDateNormalized) ? "Expires" : "Closing";
    return `    <item>
      <title>${escapeXml(`${entry.author} — ${label}: ${year}`)}</title>
      <link>${SITE_URL}/entry/${entry.id}</link>
      <guid isPermaLink="true">${SITE_URL}/entry/${entry.id}</guid>
      <description>${escapeXml(`"${entry.quote}" — ${entry.author}, ${entry.dateWritten}. ${entry.annotation}`)}</description>
      <category>${escapeXml(entry.category)}</category>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Expected World</title>
    <link>${SITE_URL}</link>
    <description>A curated archive of predictions, prophecies, and forecasts — tracking when the future was supposed to arrive.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
