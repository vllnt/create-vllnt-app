import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Subtle gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.06), transparent)',
            display: 'flex',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '9999px',
            padding: '8px 18px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
            v0.1.0 — Closed Alpha
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              display: 'flex',
            }}
          >
            Ship with{' '}
            <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '16px' }}>
              AI agents
            </span>
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              display: 'flex',
            }}
          >
            from day one
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '24px',
            display: 'flex',
          }}
        >
          npx create-vllnt-app@latest
        </div>

        {/* Tech logos row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginTop: '48px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          <span>Next.js</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span>Expo</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span>Convex</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span>Vercel</span>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '16px',
          }}
        >
          <span>vllnt.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
