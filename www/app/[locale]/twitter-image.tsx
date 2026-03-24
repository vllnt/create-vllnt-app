import { ImageResponse } from 'next/og'

import { OgContent } from './_og-content'

export const alt = 'create-vllnt-app — Ship with AI agents from day one'

export const size = {
  height: 630,
  width: 1200,
}

export const contentType = 'image/png'

export default function Image(): ImageResponse {
  return new ImageResponse(<OgContent />, { ...size })
}
