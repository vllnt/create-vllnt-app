import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  Bot,
  Check,
  FileCode2,
  Globe,
  Layers,
  Smartphone,
  Terminal,
  Wand2,
} from 'lucide-react'
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

import { CommandBlock } from './command-block'

export default function HomePage(): React.ReactNode {
  const t = useTranslations()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="container mx-auto flex flex-col items-center px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 sm:pb-28">
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 px-3.5 py-1.5 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {t('Hero.badge')}
          </Badge>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t('Hero.title_prefix')}{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {t('Hero.title_highlight')}
            </span>
            <br />
            {t('Hero.title_suffix')}
          </h1>

          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            {t('Hero.description')}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <CommandBlock command={t('Hero.command')} />
            <Button size="lg" className="gap-2" asChild>
              <a href="#modes">
                {t('Hero.cta')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Three Modes */}
      <section id="modes" className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
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
            icon={<Globe className="h-5 w-5" />}
            title={t('Modes.web.title')}
            stack={t('Modes.web.stack')}
            command={t('Modes.web.command')}
            features={[
              t('Modes.web.f1'),
              t('Modes.web.f2'),
              t('Modes.web.f3'),
              t('Modes.web.f4'),
            ]}
          />
          <ModeCard
            icon={<Smartphone className="h-5 w-5" />}
            title={t('Modes.mobile.title')}
            stack={t('Modes.mobile.stack')}
            command={t('Modes.mobile.command')}
            features={[
              t('Modes.mobile.f1'),
              t('Modes.mobile.f2'),
              t('Modes.mobile.f3'),
              t('Modes.mobile.f4'),
            ]}
          />
          <ModeCard
            icon={<Layers className="h-5 w-5" />}
            title={t('Modes.fullstack.title')}
            stack={t('Modes.fullstack.stack')}
            command={t('Modes.fullstack.command')}
            features={[
              t('Modes.fullstack.f1'),
              t('Modes.fullstack.f2'),
              t('Modes.fullstack.f3'),
              t('Modes.fullstack.f4'),
            ]}
          />
        </div>
      </section>

      <Separator />

      {/* Agent-First */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              AI-Native
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('AgentFirst.title')}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            {t('AgentFirst.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
          <AgentFileCard
            icon={<FileCode2 className="h-4 w-4" />}
            name="CLAUDE.md"
            description={t('AgentFirst.claude')}
          />
          <AgentFileCard
            icon={<FileCode2 className="h-4 w-4" />}
            name="AGENTS.md"
            description={t('AgentFirst.agents')}
          />
          <AgentFileCard
            icon={<FileCode2 className="h-4 w-4" />}
            name=".cursorrules"
            description={t('AgentFirst.cursor')}
          />
          <AgentFileCard
            icon={<FileCode2 className="h-4 w-4" />}
            name=".windsurfrules"
            description={t('AgentFirst.windsurf')}
          />
          <AgentFileCard
            icon={<FileCode2 className="h-4 w-4" />}
            name="docs/"
            description={t('AgentFirst.docs')}
          />
          <AgentFileCard
            icon={<Layers className="h-4 w-4" />}
            name="features/"
            description={t('AgentFirst.features')}
          />
        </div>
      </section>

      <Separator />

      {/* Generators */}
      <section className="container mx-auto px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-primary">
            <Wand2 className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Scaffolding
            </span>
          </div>
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
    </>
  )
}

function ModeCard({
  icon,
  title,
  stack,
  command,
  features,
}: {
  icon: React.ReactNode
  title: string
  stack: string
  command: string
  features: string[]
}): React.ReactNode {
  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{stack}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md bg-muted px-3 py-2">
          <code className="text-xs text-primary">{command}</code>
        </div>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
              {f}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function AgentFileCard({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode
  name: string
  description: string
}): React.ReactNode {
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="mt-0.5 text-muted-foreground transition-colors group-hover:text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm font-semibold text-foreground">{name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
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
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <code className="whitespace-nowrap text-sm font-medium text-foreground">
          {command}
        </code>
      </div>
      <span className="text-sm text-muted-foreground sm:ml-auto">
        {isAddon && (
          <Badge variant="secondary" className="mr-2 text-xs">
            addon
          </Badge>
        )}
        {description}
      </span>
    </div>
  )
}
