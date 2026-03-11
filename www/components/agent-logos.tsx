import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function ClaudeCodeLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('h-8 w-8', className)}
      aria-label="Claude Code"
      fill="none"
    >
      <rect width="256" height="256" rx="48" fill="#D97757" />
      <path
        d="M164.396 113.088L138.267 178.667H121.685L95.5557 113.088H112.811L130.303 162.085L148.141 113.088H164.396Z"
        fill="white"
      />
      <path
        d="M168.89 80.2988L155.621 113.088H141.066L154.335 80.2988H168.89Z"
        fill="white"
      />
    </svg>
  )
}

export function CursorLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('h-8 w-8', className)}
      aria-label="Cursor"
    >
      <rect width="256" height="256" rx="48" fill="currentColor" />
      <path
        d="M128 48L68 208H108L128 152L148 208H188L128 48Z"
        fill="currentColor"
        className="text-background"
      />
    </svg>
  )
}

export function WindsurfLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('h-8 w-8', className)}
      aria-label="Windsurf"
    >
      <rect width="256" height="256" rx="48" fill="#0EA5E9" />
      <path
        d="M68 168C68 168 88 108 128 88C168 68 188 108 188 108"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 128C68 128 88 68 128 48C168 28 188 68 188 68"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function CodexLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('h-8 w-8', className)}
      aria-label="OpenAI Codex"
    >
      <rect width="256" height="256" rx="48" fill="#10A37F" />
      <path
        d="M128 52C86.026 52 52 86.026 52 128C52 169.974 86.026 204 128 204C148.487 204 167.026 195.571 180.298 181.798"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="128" cy="128" r="24" fill="white" />
    </svg>
  )
}

export function GeminiLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn('h-8 w-8', className)}
      aria-label="Gemini CLI"
    >
      <rect width="256" height="256" rx="48" fill="#4285F4" />
      <path
        d="M128 52C128 52 180 90 180 128C180 166 128 204 128 204C128 204 76 166 76 128C76 90 128 52 128 52Z"
        fill="white"
      />
      <path
        d="M128 52C128 52 76 90 76 128C76 166 128 204 128 204"
        fill="#AECBFA"
      />
    </svg>
  )
}
