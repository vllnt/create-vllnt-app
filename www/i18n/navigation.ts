import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// eslint-disable-next-line @typescript-eslint/naming-convention -- React component from next-intl
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
