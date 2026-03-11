'use client'

import { ConvexClientProvider } from '@repo/client'
import type { ReactNode } from 'react'

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? 'https://your-deployment.convex.cloud'

export function ConvexProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ConvexClientProvider convexUrl={CONVEX_URL}>
      {children}
    </ConvexClientProvider>
  )
}
