import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tanplaygame.com'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/games',
    '/articles',
    '/search',
  ].map((path) => ({
    url: `${baseUrl}${path || '/'}`,
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.8,
  }))

  return [
    ...staticRoutes,
  ]
}


