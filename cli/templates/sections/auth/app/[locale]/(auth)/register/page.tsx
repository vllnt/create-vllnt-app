import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return { title: 'Sign up' }
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sign up</h1>
      <p className="text-muted-foreground">
        Auth not configured. Run: vllnt add auth
      </p>
    </div>
  )
}
