import type { MetadataRoute } from 'next'

const siteUrl = 'https://create-vllnt-app.vllnt.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 1,
      url: siteUrl,
    },
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 1,
      url: `${siteUrl}/en`,
    },
  ]
}
