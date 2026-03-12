import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

export function NextjsLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      aria-label="Next.js"
      className={cn('h-8 w-8', className)}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
    </svg>
  )
}

export function ExpoLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      aria-label="Expo"
      className={cn('h-8 w-8', className)}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z" />
    </svg>
  )
}

export function ConvexLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      aria-label="Convex"
      className={cn('h-8 w-8', className)}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M15.09 18.916c3.488-.387 6.776-2.246 8.586-5.348-.857 7.673-9.247 12.522-16.095 9.545a3.47 3.47 0 0 1-1.547-1.314c-1.539-2.417-2.044-5.492-1.318-8.282 2.077 3.584 6.3 5.78 10.374 5.399m-10.501-7.65c-1.414 3.266-1.475 7.092.258 10.24-6.1-4.59-6.033-14.41-.074-18.953a3.44 3.44 0 0 1 1.893-.707c2.825-.15 5.695.942 7.708 2.977-4.09.04-8.073 2.66-9.785 6.442m11.757-5.437C14.283 2.951 11.053.992 7.515.933c6.84-3.105 15.253 1.929 16.17 9.37a3.6 3.6 0 0 1-.334 2.02c-1.278 2.594-3.647 4.607-6.416 5.352 2.029-3.763 1.778-8.36-.589-11.847" />
    </svg>
  )
}

export function VercelLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      aria-label="Vercel"
      className={cn('h-8 w-8', className)}
      fill="currentColor"
      viewBox="0 0 74 64"
    >
      <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" />
    </svg>
  )
}
