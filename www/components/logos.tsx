import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function NextjsLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      className={cn('h-8 w-8', className)}
      aria-label="Next.js"
    >
      <mask
        id="nextjs-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
        style={{ maskType: 'alpha' }}
      >
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#nextjs-mask)">
        <circle cx="90" cy="90" r="90" fill="black" className="dark:fill-white" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#nextjs-grad-0)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#nextjs-grad-1)" />
      </g>
      <defs>
        <linearGradient
          id="nextjs-grad-0"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" className="dark:[stop-color:black]" />
          <stop offset="1" stopColor="white" stopOpacity="0" className="dark:[stop-color:black]" />
        </linearGradient>
        <linearGradient
          id="nextjs-grad-1"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" className="dark:[stop-color:black]" />
          <stop offset="1" stopColor="white" stopOpacity="0" className="dark:[stop-color:black]" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ExpoLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 228"
      className={cn('h-8 w-8', className)}
      aria-label="Expo"
    >
      <path
        d="M119.616 6.516c3.793-5.59 7.147-8.203 12.384-8.203 5.237 0 8.591 2.614 12.384 8.203 20.158 29.715 66.781 115.778 80.669 140.103 6.818 11.944 4.477 22.143-2.093 31.854-8.058 11.905-22.777 25.867-33.024 33.627-9.349 7.078-14.98 10.443-23.717 10.443-6.6 0-14.13-3.8-22.552-8.16-5.413-2.802-11.349-5.87-18.667-5.87-7.318 0-13.254 3.068-18.667 5.87-8.422 4.36-15.952 8.16-22.552 8.16-8.737 0-14.368-3.365-23.717-10.443C51.824 204.34 37.105 190.378 29.047 178.473c-6.57-9.711-8.911-19.91-2.093-31.854C40.842 122.294 87.465 36.231 107.623 6.516h-.024.024-.007Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ConvexLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn('h-8 w-8', className)}
      aria-label="Convex"
      fill="none"
    >
      <path
        d="M40 0C17.909 0 0 17.909 0 40s17.909 40 40 40 40-17.909 40-40S62.091 0 40 0Z"
        fill="#F3722C"
      />
      <path
        d="M55.6 29.2c-2.4-4.1-6.8-6.8-11.8-6.8H36.2c-5 0-9.4 2.7-11.8 6.8l-3.8 6.6c-2.4 4.1-2.4 9.2 0 13.4l3.8 6.6c2.4 4.1 6.8 6.8 11.8 6.8h7.6c5 0 9.4-2.7 11.8-6.8l3.8-6.6c2.4-4.1 2.4-9.2 0-13.4l-3.8-6.6Z"
        fill="white"
      />
    </svg>
  )
}

export function VercelLogo({ className }: LogoProps): React.ReactNode {
  return (
    <svg
      viewBox="0 0 256 222"
      className={cn('h-8 w-8', className)}
      aria-label="Vercel"
    >
      <path d="M128 0L256 221.705H0L128 0Z" fill="currentColor" />
    </svg>
  )
}
