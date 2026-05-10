import { ImageResponse } from 'next/og';
import { getEntryById, getAllEntries, isExpired } from '@/lib/corpus';

export const alt = 'The Expected World — Entry';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return getAllEntries().map((e) => ({ slug: e.id }));
}

const COLORS = ['#E8652A', '#2B5CE6', '#1A8C54', '#D4952B'];

function colorForEntry(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntryById(slug);

  if (!entry) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F5F2EB',
            fontSize: 48,
          }}
        >
          The Expected World
        </div>
      ),
      { ...size }
    );
  }

  const accentColor = colorForEntry(entry.id);
  const expired = isExpired(entry.predictedDateNormalized);
  const label = expired ? 'EXPIRED' : 'CLOSING';
  const year = entry.predictedDateNormalized.slice(0, 4);

  // Truncate quote for display
  const maxQuoteLen = 220;
  const quoteText =
    entry.quote.length > maxQuoteLen
      ? entry.quote.slice(0, maxQuoteLen).trimEnd() + '\u2026'
      : entry.quote;

  const sourceText =
    entry.source.length > 80
      ? entry.source.slice(0, 80).trimEnd() + '\u2026'
      : entry.source;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000',
        }}
      >
        {/* Left accent column */}
        <div
          style={{
            width: 280,
            height: '100%',
            background: accentColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 32px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              {year}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {`Written ${entry.dateWritten}`}
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {entry.category}
            </span>
          </div>
        </div>

        {/* Right quote area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 56px',
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontStyle: 'italic',
              color: '#F5F2EB',
              lineHeight: 1.55,
              marginBottom: 32,
            }}
          >
            {`\u201C${quoteText}\u201D`}
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#F5F2EB',
            }}
          >
            {entry.author}
          </div>

          <div
            style={{
              fontSize: 12,
              color: 'rgba(245,242,235,0.4)',
              marginTop: 6,
              letterSpacing: '0.04em',
            }}
          >
            {sourceText}
          </div>
        </div>

        {/* Bottom branding bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 280,
            right: 0,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 56px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,235,0.35)',
            }}
          >
            theexpectedworld.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
