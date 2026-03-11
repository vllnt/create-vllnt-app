export default function HomePage(): React.ReactNode {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm text-[var(--muted)]">
          v0.1.0 — Alpha
        </div>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Ship with{' '}
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent">
            AI agents
          </span>{' '}
          from day one
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--muted)] sm:text-xl">
          Scaffold production-grade Next.js, Expo, or fullstack monorepo projects with Convex
          backend. CLAUDE.md + agent contracts included.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <code className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-lg font-mono">
            npx create-vllnt-app
          </code>
        </div>
      </section>

      {/* Three Modes */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Three modes. One command.</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <ModeCard
            title="Web"
            command="npx create-vllnt-app --template web"
            stack="Next.js 15 + Convex + Tailwind v4 + next-intl"
            features={[
              'App Router + Server Components',
              'Feature-sliced architecture',
              'i18n out of the box',
              'Convex real-time backend',
            ]}
          />
          <ModeCard
            title="Mobile"
            command="npx create-vllnt-app --template mobile"
            stack="Expo 55 + Convex + React Native + i18next"
            features={[
              'Expo Router (typed routes)',
              'Feature-sliced architecture',
              'Dark mode + theming',
              'Maestro E2E testing',
            ]}
          />
          <ModeCard
            title="Fullstack"
            command="npx create-vllnt-app --template fullstack"
            stack="Turborepo + Next.js + Expo + Convex"
            features={[
              'Shared Convex backend',
              'Universal React hooks',
              'Cross-platform tokens',
              'turbo build pipeline',
            ]}
          />
        </div>
      </section>

      {/* Agent-First */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Agent-first development</h2>
        <p className="mb-12 text-center text-lg text-[var(--muted)]">
          Every scaffolded project ships with AI agent contracts that make Claude, Cursor, and
          Windsurf immediately productive.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <AgentFile name="CLAUDE.md" description="Blocking rules, stack info, conventions" />
          <AgentFile name="AGENTS.md" description="Architecture, extension points, pitfalls" />
          <AgentFile name=".cursorrules" description="Cursor-specific agent rules" />
          <AgentFile name=".windsurfrules" description="Windsurf-specific agent rules" />
          <AgentFile name="docs/ (6 files)" description="Architecture, testing, i18n, theming, conventions, extending" />
          <AgentFile name="features/" description="Vertical slices — ready for AI scaffolding" />
        </div>
      </section>

      {/* Generators */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Code generators</h2>
        <p className="mb-12 text-center text-lg text-[var(--muted)]">
          Generate pages, screens, features, components, hooks, and Convex domains with a single
          command.
        </p>
        <div className="space-y-3">
          <GeneratorRow command="vllnt generate page Dashboard" description="New page with layout + metadata + i18n" />
          <GeneratorRow command="vllnt generate feature billing" description="Feature slice: components/ + hooks/ + index.ts" />
          <GeneratorRow command="vllnt generate domain billing" description="Convex domain: schemas + queries + mutations" />
          <GeneratorRow command="vllnt generate component Button" description="Shared UI component in components/ui/" />
          <GeneratorRow command="vllnt generate hook use-debounce" description="Custom hook in hooks/" />
          <GeneratorRow command="vllnt add auth" description="BetterAuth + Convex integration" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-12 text-center text-sm text-[var(--muted)]">
        <p>
          Built by{' '}
          <a
            href="https://bntvllnt.com"
            className="text-[var(--accent-light)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            bntvllnt
          </a>
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/bntvllnt/create-vllnt-app"
            className="text-[var(--accent-light)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  )
}

function ModeCard({
  title,
  command,
  stack,
  features,
}: {
  title: string
  command: string
  stack: string
  features: string[]
}): React.ReactNode {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h3 className="mb-1 text-xl font-bold">{title}</h3>
      <p className="mb-4 text-sm text-[var(--muted)]">{stack}</p>
      <code className="mb-4 block rounded bg-black/30 px-3 py-2 text-xs font-mono text-[var(--accent-light)]">
        {command}
      </code>
      <ul className="space-y-1.5 text-sm text-[var(--muted)]">
        {features.map((f) => (
          <li key={f}>- {f}</li>
        ))}
      </ul>
    </div>
  )
}

function AgentFile({ name, description }: { name: string; description: string }): React.ReactNode {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex-1">
        <p className="font-mono text-sm font-bold text-[var(--accent-light)]">{name}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
    </div>
  )
}

function GeneratorRow({ command, description }: { command: string; description: string }): React.ReactNode {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      <code className="font-mono text-sm text-[var(--accent-light)]">{command}</code>
      <span className="text-sm text-[var(--muted)]">{description}</span>
    </div>
  )
}
