import { GitHubStars } from '@/components/github-stars'
import { ThemeToggle } from '@/components/theme-toggle'
import { Link } from '@/i18n/navigation'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <nav
          aria-label="Main"
          className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6"
        >
          <Link className="text-base font-bold tracking-tight" href="/">
            create-vllnt-app
          </Link>
          <div className="flex items-center gap-3">
            <Link
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
              href="/manifesto"
            >
              Manifesto
            </Link>
            <GitHubStars count={128} owner="vllnt" repo="create-vllnt-app" />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto flex items-center justify-center gap-4 px-4">
          <span>
            Built by{' '}
            <a
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href="https://vllnt.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              vllnt.com
            </a>
          </span>
          <span className="text-border">|</span>
          <a
            className="font-medium text-foreground underline-offset-4 hover:underline"
            href="https://github.com/vllnt/create-vllnt-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  )
}
