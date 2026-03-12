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
          {t('Hero.title_prefix')} {t('Hero.title_highlight')}
          <br />
          {t('Hero.title_suffix')}
        </h1>

        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
          {t('Hero.description')}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <CommandBlock command={t('Hero.command')} />
          <Button asChild size="lg">
            <a href="#modes">{t('Hero.cta')}</a>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Three Modes */}
      <section
        className="container mx-auto px-4 py-20 sm:px-6 sm:py-28"
        id="modes"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Modes.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Modes.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <ModeCard
            command={t('Modes.web.command')}
            features={[
              t('Modes.web.f1'),
              t('Modes.web.f2'),
              t('Modes.web.f3'),
              t('Modes.web.f4'),
            ]}
            stack={t('Modes.web.stack')}
            title={t('Modes.web.title')}
          />
          <ModeCard
            command={t('Modes.mobile.command')}
            features={[
              t('Modes.mobile.f1'),
              t('Modes.mobile.f2'),
              t('Modes.mobile.f3'),
              t('Modes.mobile.f4'),
            ]}
            stack={t('Modes.mobile.stack')}
            title={t('Modes.mobile.title')}
          />
          <ModeCard
            command={t('Modes.fullstack.command')}
            features={[
              t('Modes.fullstack.f1'),
              t('Modes.fullstack.f2'),
              t('Modes.fullstack.f3'),
              t('Modes.fullstack.f4'),
            ]}
            stack={t('Modes.fullstack.stack')}
            title={t('Modes.fullstack.title')}
          />
        </div>
      </section>

      <Separator />

      {/* Agent-First Primitives */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('AgentFirst.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('AgentFirst.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Agent Rules
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <AgentFileCard description={t('AgentFirst.claude')} />
              <AgentFileCard description={t('AgentFirst.agents')} />
              <AgentFileCard description={t('AgentFirst.cursor')} />
              <AgentFileCard description={t('AgentFirst.windsurf')} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Context &amp; Scaffolding
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <AgentFileCard description={t('AgentFirst.docs')} />
              <AgentFileCard description={t('AgentFirst.features')} />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Supported AI Agents */}
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
      </section>

      <Separator />

      {/* Generators */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Generators.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Generators.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-2">
          <GeneratorRow
            command={t('Generators.g1_cmd')}
            description={t('Generators.g1_desc')}
          />
          <GeneratorRow
            command={t('Generators.g2_cmd')}
            description={t('Generators.g2_desc')}
          />
          <GeneratorRow
            command={t('Generators.g3_cmd')}
            description={t('Generators.g3_desc')}
          />
          <GeneratorRow
            command={t('Generators.g4_cmd')}
            description={t('Generators.g4_desc')}
          />
          <Separator className="my-4" />
          <GeneratorRow
            command={t('Generators.g5_cmd')}
            description={t('Generators.g5_desc')}
            isAddon
          />
          <GeneratorRow
            command={t('Generators.g6_cmd')}
            description={t('Generators.g6_desc')}
            isAddon
          />
        </div>
      </section>

      <Separator />

      {/* Foundations — @vllnt packages */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Foundations.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Foundations.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
          <PackageCard
            description={t('Foundations.ui_desc')}
            href="https://www.npmjs.com/package/@vllnt/ui"
            name={t('Foundations.ui_name')}
          />
          <PackageCard
            description={t('Foundations.eslint_desc')}
            href="https://www.npmjs.com/package/@vllnt/eslint-config"
            name={t('Foundations.eslint_name')}
          />
          <PackageCard
            description={t('Foundations.typescript_desc')}
            href="https://www.npmjs.com/package/@vllnt/typescript"
            name={t('Foundations.typescript_name')}
          />
          <PackageCard
            description={t('Foundations.logger_desc')}
            href="https://www.npmjs.com/package/@vllnt/logger"
            name={t('Foundations.logger_name')}
          />
          <PackageCard
            className="sm:col-span-2"
            description={t('Foundations.analytics_desc')}
            href="https://www.npmjs.com/package/@vllnt/analytics"
            name={t('Foundations.analytics_name')}
          />
        </div>
      </section>

      <Separator />

      {/* Stack & Recommendations */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('Stack.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('Stack.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 flex items-center justify-center gap-8 sm:gap-12">
          <a
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href="https://nextjs.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            <NextjsLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-xs font-medium">Next.js</span>
          </a>
          <a
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href="https://expo.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExpoLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-xs font-medium">Expo</span>
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

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-5">
            <div className="mb-3 flex items-center gap-2">
              <VercelLogo className="h-5 w-5" />
              <span className="text-sm font-semibold text-foreground">
                Vercel
              </span>
              <Badge className="text-xs" variant="secondary">
                recommended
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t('Stack.vercel')}</p>
          </div>
          <div className="rounded-lg border border-border p-5">
            <div className="mb-3 flex items-center gap-2">
              <ConvexLogo className="h-5 w-5" />
              <span className="text-sm font-semibold text-foreground">
                Convex Cloud
              </span>
              <Badge className="text-xs" variant="secondary">
                recommended
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t('Stack.convex')}</p>
          </div>
        </div>
      </section>
    </>
  )
}

function ModeCard({
  command,
  features,
  stack,
  title,
}: {
  command: string
  features: string[]
  stack: string
  title: string
}): React.ReactNode {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex-1">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="min-h-[2.5rem] text-sm">
          {stack}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md bg-zinc-950 px-3 py-2.5 dark:bg-zinc-900">
          <code className="text-xs text-zinc-300">$ {command}</code>
        </div>
        <ul className="space-y-2">
          {features.map((f) => (
            <li className="text-sm text-muted-foreground" key={f}>
              {f}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function AgentFileCard({
  description,
}: {
  description: string
}): React.ReactNode {
  const parts = description.split(' — ')
  const fileName = parts[0]
  const desc = parts.length > 1 ? parts[1] : description

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-foreground">{fileName}</p>
      {parts.length > 1 && (
        <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      )}
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

function PackageCard({
  className,
  description,
  href,
  name,
}: {
  className?: string
  description: string
  href: string
  name: string
}): React.ReactNode {
  return (
    <a
      className={`block rounded-lg border border-border p-4 transition-colors hover:bg-accent/50 ${className ?? ''}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
    </a>
  )
}

function GeneratorRow({
  command,
  description,
  isAddon = false,
}: {
  command: string
  description: string
  isAddon?: boolean
}): React.ReactNode {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      <code className="whitespace-nowrap text-sm font-medium text-foreground">
        $ {command}
      </code>
      <span className="text-sm text-muted-foreground sm:ml-auto">
        {isAddon ? (
          <Badge className="mr-2 text-xs" variant="secondary">
            addon
          </Badge>
        ) : null}
        {description}
      </span>
    </div>
  )
}
