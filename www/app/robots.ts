import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      userAgent: '*',
    },
    sitemap: 'https://create-vllnt-app.vllnt.com/sitemap.xml',
  }
}
