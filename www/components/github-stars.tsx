import { Star } from 'lucide-react'

type GitHubStarsProps = {
  owner: string
  repo: string
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return count.toString()
}

async function fetchStarCount(owner: string, repo: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { next: { revalidate: 3600 } },
    )
    if (!response.ok) return 0
    const data = (await response.json()) as { stargazers_count: number }
    return data.stargazers_count
  } catch {
    return 0
  }
}

export async function GitHubStars({
  owner,
  repo,
}: GitHubStarsProps): Promise<React.ReactNode> {
  const count = await fetchStarCount(owner, repo)

  return (
    <a
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      href={`https://github.com/${owner}/${repo}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Star className="h-3.5 w-3.5" />
      {count > 0 && <span>{formatCount(count)}</span>}
      <span>Star</span>
    </a>
  )
}
