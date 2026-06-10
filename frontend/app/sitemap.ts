import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.illusorydesignstudios.com'
  const routes = [
    '', '/services', '/works', '/team', '/about',
    '/contact', '/careers', '/packages',
    '/policies/privacy-policy', '/policies/refund-policy',
    '/policies/terms-service', '/policies/use-policy'
  ]
  return routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
