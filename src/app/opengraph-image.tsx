import { ImageResponse } from 'next/og';

export const alt = 'The Expected World — An archive of expired futures';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#000',
          position: 'relative',
        }}
      >
        {/* Accent bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            display: 'flex',
          }}
        >
          <div style={{ flex: 1, background: '#E8652A' }} />
          <div style={{ flex: 1, background: '#2B5CE6' }} />
          <div style={{ flex: 1, background: '#1A8C54' }} />
          <div style={{ flex: 1, background: '#D4952B' }} />
        </div>

        {/* Sealed E */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '2.5px solid #F5F2EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 52,
              color: '#F5F2EB',
              fontFamily: 'Georgia, serif',
              lineHeight: 1,
              marginTop: -4,
            }}
          >
            E
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#F5F2EB',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          The Expected World
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            fontStyle: 'italic',
            color: 'rgba(245, 242, 235, 0.5)',
            marginTop: 16,
          }}
        >
          An archive of expired futures
        </div>
      </div>
    ),
    { ...size }
  );
}
