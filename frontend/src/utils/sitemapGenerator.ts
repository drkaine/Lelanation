interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

interface SitemapConfig {
  baseUrl: string
  routes: SitemapUrl[]
}

export function generateSitemap(config: SitemapConfig): string {
  const { baseUrl, routes } = config

  const urlElements = routes
    .map(route => {
      const lastmod = route.lastmod || new Date().toISOString().split('T')[0]
      const changefreq = route.changefreq || 'weekly'
      const priority = route.priority || 0.5

      return `  <url>
    <loc>${baseUrl}${route.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
}

export function getLelanationSitemapConfig(): SitemapConfig {
  const baseUrl = 'https://www.lelanation.fr'

  const routes: SitemapUrl[] = [
    {
      loc: '/',
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      loc: '/build',
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: '/builds-publics',
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: '/dictionnaire',
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: '/videos',
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/legal',
      changefreq: 'monthly',
      priority: 0.3,
    },
  ]

  return { baseUrl, routes }
}

export function generateLelanationSitemap(): string {
  const config = getLelanationSitemapConfig()
  return generateSitemap(config)
}
