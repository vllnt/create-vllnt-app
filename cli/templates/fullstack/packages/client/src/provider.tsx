import { ConvexReactClient, ConvexProvider } from 'convex/react'
import type { ReactNode } from 'react'

let convexClient: ConvexReactClient | null = null

function getConvexClient(url: string): ConvexReactClient {
  if (!convexClient) {
    convexClient = new ConvexReactClient(url)
  }
  return convexClient
}

interface ConvexClientProviderProps {
  children: ReactNode
  convexUrl: string
}

export function ConvexClientProvider({
  children,
  convexUrl,
}: ConvexClientProviderProps): JSX.Element {
  const client = getConvexClient(convexUrl)
  return <ConvexProvider client={client}>{children}</ConvexProvider>
}
