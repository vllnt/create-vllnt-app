'use client'

import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? '',
)

interface Props {
  children: React.ReactNode
}

export function ConvexProvider({ children }: Props) {
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>
}
