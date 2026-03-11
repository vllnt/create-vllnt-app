import { ConvexReactClient, ConvexProvider as BaseConvexProvider } from 'convex/react'
import type { ReactNode } from 'react'

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL ?? 'https://your-deployment.convex.cloud',
)

interface ConvexProviderProps {
  children: ReactNode
}

export function ConvexProvider({ children }: ConvexProviderProps): JSX.Element {
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>
}
