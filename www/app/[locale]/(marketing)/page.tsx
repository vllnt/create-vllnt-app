import { Badge } from '@vllnt/ui'
import { Button } from '@vllnt/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@vllnt/ui'
import { Separator } from '@vllnt/ui'
import { useTranslations } from 'next-intl'

import {
  ClaudeLogo,
  CursorLogo,
  GeminiLogo,
  OpenAILogo,
  WindsurfLogo,
} from '@/components/agent-logos'
import {
  ConvexLogo,
  ExpoLogo,
  NextjsLogo,
  VercelLogo,
} from '@/components/logos'

import { CommandBlock } from './command-block'

export default function HomePage(): React.ReactNode {
  const t = useTranslations()

  return (
    <>
      {/* Hero */}
      <section className="container mx-auto flex flex-col items-center px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 sm:pb-28">
        <Badge
          className="mb-6 px-3.5 py-1.5 text-sm font-medium"
          variant="outline"
        >
          {t('Hero.badge')}
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {t('Hero.title_prefix')}
          <br />
          <span className="text-muted-foreground">
            {t('Hero.title_highlight')}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
          {t('Hero.description')}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <CommandBlock command={t('Hero.command')} />
          <Button asChild size="lg">
            <a href="#presets">{t('Hero.cta')}</a>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Presets */}
      <section
        className="container mx-auto px-4 py-20 sm:px-6 sm:py-28"
        id="presets"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Presets.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Presets.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PresetCard
            command="--preset landing"
            name={t('Presets.landing')}
            sections="landing"
          />
          <PresetCard
            command="--preset blog"
            name={t('Presets.blog')}
            sections="blog"
          />
          <PresetCard
            command="--preset marketing"
            name={t('Presets.marketing')}
            sections="landing + blog"
          />
          <PresetCard
            command="--preset saas"
            highlight
            name={t('Presets.saas')}
            sections="landing + dashboard + auth"
          />
          <PresetCard
            command="--preset full-saas"
            name={t('Presets.full_saas')}
            sections="landing + dashboard + auth + blog + docs"
          />
          <PresetCard
            command="--preset dashboard"
            name={t('Presets.dashboard')}
            sections="dashboard + auth"
          />
          <PresetCard
            command="--preset internal"
            name={t('Presets.internal')}
            sections="dashboard + admin + auth"
          />
          <PresetCard
            command="--preset docs"
            name={t('Presets.docs')}
            sections="docs"
          />
          <PresetCard
            command="Custom"
            name={t('Presets.custom')}
            sections={t('Presets.custom_hint')}
          />
        </div>
      </section>

      <Separator />

      {/* Composable Sections */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Sections.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Sections.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SectionCard desc={t('Sections.landing')} name="Landing" />
          <SectionCard desc={t('Sections.blog')} name="Blog" />
          <SectionCard desc={t('Sections.dashboard')} name="Dashboard" />
          <SectionCard desc={t('Sections.auth')} name="Auth" />
          <SectionCard desc={t('Sections.docs')} name="Docs" />
          <SectionCard desc={t('Sections.admin')} name="Admin" />
        </div>
      </section>

      <Separator />

      {/* Agent-First */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('AgentFirst.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('AgentFirst.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-lg border border-border bg-zinc-950 p-5 dark:bg-zinc-900">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t('AgentFirst.workflow_label')}
            </p>
            <div className="space-y-1.5 font-mono text-sm text-zinc-300">
              <p>
                <span className="text-zinc-500">1.</span>{' '}
                {t('AgentFirst.step1')}
              </p>
              <p>
                <span className="text-zinc-500">2.</span>{' '}
                {t('AgentFirst.step2')}
              </p>
              <p>
                <span className="text-zinc-500">3.</span>{' '}
                {t('AgentFirst.step3')}
              </p>
              <p>
                <span className="text-zinc-500">4.</span>{' '}
                {t('AgentFirst.step4')}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <AgentFileCard desc={t('AgentFirst.claude')} name="CLAUDE.md" />
            <AgentFileCard desc={t('AgentFirst.agents')} name="AGENTS.md" />
            <AgentFileCard
              desc={t('AgentFirst.vllnt_json')}
              name="vllnt.json"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Guardrails */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Guardrails.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Guardrails.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <GuardrailCard
            desc={t('Guardrails.eslint')}
            name="@vllnt/eslint-config"
          />
          <GuardrailCard
            desc={t('Guardrails.typescript')}
            name="TypeScript strict"
          />
          <GuardrailCard
            desc={t('Guardrails.convex')}
            name="Convex validators"
          />
          <GuardrailCard
            desc={t('Guardrails.zero_error')}
            name="Zero-Error Guarantee"
          />
        </div>
      </section>

      <Separator />

      {/* Doctor */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Doctor.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Doctor.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-border bg-zinc-950 p-5 dark:bg-zinc-900">
          <pre className="font-mono text-sm text-zinc-300">
            <code>
              {'$ vllnt doctor --json\n'}
              {'{\n'}
              {'  "status": "pass",\n'}
              {'  "message": "All 8 checks passing",\n'}
              {'  "fix": { "cmd": "pnpm", "args": ["install"] }\n'}
              {'}'}
            </code>
          </pre>
        </div>

        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4 text-center">
            <code className="text-sm font-medium text-foreground">
              vllnt doctor
            </code>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('Doctor.check')}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <code className="text-sm font-medium text-foreground">
              --for blog
            </code>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('Doctor.preflight')}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <code className="text-sm font-medium text-foreground">--json</code>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('Doctor.agent_output')}
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Supported Agents + Stack */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Agents.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Agents.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          <AgentLogoItem
            logo={<ClaudeLogo className="h-12 w-12 sm:h-14 sm:w-14" />}
            name="Claude Code"
          />
          <AgentLogoItem
            logo={<OpenAILogo className="h-12 w-12 sm:h-14 sm:w-14" />}
            name="Codex"
          />
          <AgentLogoItem
            logo={<CursorLogo className="h-12 w-12 sm:h-14 sm:w-14" />}
            name="Cursor"
          />
          <AgentLogoItem
            logo={<WindsurfLogo className="h-12 w-12 sm:h-14 sm:w-14" />}
            name="Windsurf"
          />
          <AgentLogoItem
            logo={<GeminiLogo className="h-12 w-12 sm:h-14 sm:w-14" />}
            name="Gemini CLI"
          />
        </div>

        <div className="mx-auto mt-12 flex items-center justify-center gap-8 sm:gap-12">
          <a
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href="https://nextjs.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            <NextjsLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-xs font-medium">Next.js 16</span>
          </a>
          <a
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href="https://expo.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExpoLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-xs font-medium">Expo 55</span>
          </a>
          <a
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href="https://convex.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ConvexLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-xs font-medium">Convex</span>
          </a>
          <a
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href="https://vercel.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <VercelLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-xs font-medium">Vercel</span>
          </a>
        </div>
      </section>
    </>
  )
}

function PresetCard({
  command,
  highlight = false,
  name,
  sections,
}: {
  command: string
  highlight?: boolean
  name: string
  sections: string
}): React.ReactNode {
  return (
    <Card
      className={`flex flex-col overflow-hidden ${highlight ? 'border-foreground' : ''}`}
    >
      <CardHeader className="flex-1 pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-xs">{sections}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-zinc-950 px-3 py-2 dark:bg-zinc-900">
          <code className="text-xs text-zinc-300">{command}</code>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionCard({
  desc,
  name,
}: {
  desc: string
  name: string
}): React.ReactNode {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function AgentFileCard({
  desc,
  name,
}: {
  desc: string
  name: string
}): React.ReactNode {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function GuardrailCard({
  desc,
  name,
}: {
  desc: string
  name: string
}): React.ReactNode {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function AgentLogoItem({
  logo,
  name,
}: {
  logo: React.ReactNode
  name: string
}): React.ReactNode {
  return (
    <div className="flex flex-col items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground">
      {logo}
      <span className="text-xs font-medium">{name}</span>
    </div>
  )
}
