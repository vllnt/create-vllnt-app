export interface SectionMeta {
  name: string
  routeGroup: string
  requires: string[]
  requiresBackend: boolean
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  i18nNamespace: string
  i18nKeys: Record<string, Record<string, string>>
  claudeMdRules: string[]
  agentsMdExtensions: string
}

export interface Preset {
  name: string
  label: string
  hint: string
  sections: string[]
  backend: boolean
}

export const PRESETS: Preset[] = [
  {
    name: 'landing',
    label: 'Landing Page',
    hint: 'Marketing page — no backend',
    sections: ['landing'],
    backend: false,
  },
  {
    name: 'blog',
    label: 'Blog',
    hint: 'MDX blog — no backend',
    sections: ['blog'],
    backend: false,
  },
  {
    name: 'marketing',
    label: 'Marketing Site',
    hint: 'Landing page + blog — no backend',
    sections: ['landing', 'blog'],
    backend: false,
  },
  {
    name: 'saas',
    label: 'SaaS',
    hint: 'Landing + dashboard + auth + Convex backend',
    sections: ['landing', 'dashboard', 'auth'],
    backend: true,
  },
  {
    name: 'saas-blog',
    label: 'SaaS + Blog',
    hint: 'Landing + dashboard + auth + blog + Convex',
    sections: ['landing', 'dashboard', 'auth', 'blog'],
    backend: true,
  },
  {
    name: 'full-saas',
    label: 'Full SaaS',
    hint: 'Landing + dashboard + auth + blog + docs + Convex',
    sections: ['landing', 'dashboard', 'auth', 'blog', 'docs'],
    backend: true,
  },
  {
    name: 'dashboard',
    label: 'Dashboard',
    hint: 'Dashboard + auth + Convex backend',
    sections: ['dashboard', 'auth'],
    backend: true,
  },
  {
    name: 'internal',
    label: 'Internal Tool',
    hint: 'Dashboard + admin + auth + Convex',
    sections: ['dashboard', 'admin', 'auth'],
    backend: true,
  },
  {
    name: 'docs',
    label: 'Docs Site',
    hint: 'Documentation site — no backend',
    sections: ['docs'],
    backend: false,
  },
]

export const ALL_SECTIONS = ['landing', 'blog', 'dashboard', 'auth', 'docs', 'admin'] as const
export type SectionName = (typeof ALL_SECTIONS)[number]

const SECTION_DEPS: Record<string, string[]> = {
  landing: [],
  blog: [],
  docs: [],
  dashboard: ['auth'],
  auth: [],
  admin: ['auth'],
}

export function resolveTransitiveDeps(sections: string[]): string[] {
  const resolved = new Set<string>()

  function resolve(section: string): void {
    if (resolved.has(section)) return
    const deps = SECTION_DEPS[section] ?? []
    for (const dep of deps) {
      resolve(dep)
    }
    resolved.add(section)
  }

  for (const section of sections) {
    resolve(section)
  }

  return [...resolved]
}

export function getPreset(name: string): Preset | undefined {
  return PRESETS.find((p) => p.name === name)
}

export function needsBackend(sections: string[]): boolean {
  return sections.some((s) => {
    const deps = SECTION_DEPS[s]
    return deps !== undefined && (s === 'dashboard' || s === 'auth' || s === 'admin')
  })
}
