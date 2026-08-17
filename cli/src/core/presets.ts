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
    name: 'admin',
    label: 'Admin Console',
    hint: 'Dashboard + admin workflows + auth + Convex',
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

export interface SectionDep {
  requires: string[]
  requiresBackend: boolean
}

export const SECTION_DEPS: Record<string, SectionDep> = {
  landing: { requires: [], requiresBackend: false },
  blog: { requires: [], requiresBackend: false },
  docs: { requires: [], requiresBackend: false },
  dashboard: { requires: ['auth'], requiresBackend: true },
  auth: { requires: [], requiresBackend: true },
  admin: { requires: ['auth'], requiresBackend: true },
}

export function resolveTransitiveDeps(sections: string[]): string[] {
  const resolved = new Set<string>()

  function resolve(section: string): void {
    if (resolved.has(section)) return
    const entry = SECTION_DEPS[section]
    const deps = entry?.requires ?? []
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

export const PRESET_ALIASES: Record<string, string> = {
  // Backward compatibility for projects/scripts created before the public preset was renamed.
  internal: 'admin',
}

export function getPreset(name: string): Preset | undefined {
  const canonicalName = PRESET_ALIASES[name] ?? name
  return PRESETS.find((p) => p.name === canonicalName)
}

export function needsBackend(sections: string[]): boolean {
  return sections.some((s) => SECTION_DEPS[s]?.requiresBackend === true)
}
