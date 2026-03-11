import { Link } from '@/i18n/navigation'
import { GitHubStars } from '@/components/github-stars'
import { ThemeToggle } from '@/components/theme-toggle'

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
            <GitHubStars owner="vllnt" repo="create-vllnt-app" count={128} />
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
              href="https://bntvllnt.com"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              bntvllnt
            </a>
          </span>
          <span className="text-border">|</span>
          <a
            href="https://github.com/vllnt/create-vllnt-app"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  )
}
