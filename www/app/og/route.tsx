import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const fontStack = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

function OgBadge(): React.ReactNode {
  return (
    <div
      style={{
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '9999px',
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        padding: '8px 18px',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
        v0.1.0 — Closed Alpha
      </span>
    </div>
  )
}

function OgTitle(): React.ReactNode {
  const headingStyle = {
    color: 'white',
    display: 'flex' as const,
    fontSize: '64px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '4px',
      }}
    >
      <div style={headingStyle}>Ship with AI agents</div>
      <div style={headingStyle}>from day one</div>
    </div>
  )
}

function OgFooter(): React.ReactNode {
  return (
    <>
      <div
        style={{
          color: 'rgba(255,255,255,0.5)',
          display: 'flex',
          fontSize: '22px',
          marginTop: '24px',
        }}
      >
        npx create-vllnt-app@latest
      </div>

      <div
        style={{
          alignItems: 'center',
          color: 'rgba(255,255,255,0.4)',
          display: 'flex',
          fontSize: '16px',
          fontWeight: 500,
          gap: '32px',
          marginTop: '48px',
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

      <div
        style={{
          bottom: '32px',
          color: 'rgba(255,255,255,0.3)',
          display: 'flex',
          fontSize: '16px',
          position: 'absolute' as const,
        }}
      >
        <span>vllnt.com</span>
      </div>
    </>
  )
}

export function GET(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#09090b',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: fontStack,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <OgBadge />
      <OgTitle />
      <OgFooter />
    </div>,
    { height: 630, width: 1200 },
  )
}
