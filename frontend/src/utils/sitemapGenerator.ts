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
  images?: SitemapImage[]
}

interface SitemapImage {
  loc: string
  title?: string
  caption?: string
  geo_location?: string
  license?: string
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

      let imageElements = ''
      if (route.images && route.images.length > 0) {
        imageElements = route.images
          .map(img => {
            let imageContent = `    <image:image>
      <image:loc>${img.loc}</image:loc>`

            if (img.title) {
              imageContent += `
      <image:title>${img.title}</image:title>`
            }

            if (img.caption) {
              imageContent += `
      <image:caption>${img.caption}</image:caption>`
            }

            if (img.geo_location) {
              imageContent += `
      <image:geo_location>${img.geo_location}</image:geo_location>`
            }

            if (img.license) {
              imageContent += `
      <image:license>${img.license}</image:license>`
            }

            imageContent += `
    </image:image>`

            return imageContent
          })
          .join('\n')
      }

      return `  <url>
    <loc>${baseUrl}${route.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageElements ? '\n' + imageElements : ''}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`
}

export function getLelanationSitemapConfig(): SitemapConfig {
  const baseUrl = 'https://www.lelanation.fr'
  const currentDate = '2025-06-03' // Date cohérente avec votre sitemap actuel

  const routes: SitemapUrl[] = [
    {
      loc: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0,
      images: [
        {
          loc: 'https://www.lelanation.fr/assets/images/lelariva.webp',
          title: 'Lelariva - Expert League of Legends et créateur de builds',
          caption:
            'Portrait de Lelariva, expert League of Legends, créateur de contenu et fondateur de Lelanation',
          geo_location: 'France',
          license: 'https://www.lelanation.fr/legal',
        },
      ],
    },
    {
      loc: '/build',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: '/builds-publics',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: '/Lebuildarriva',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: '/videos',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/dictionnaire',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: '/dictionnaire/proposition',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: '/statistique',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
    },
    {
      loc: '/legal',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3,
    },
  ]

  return { baseUrl, routes }
}

export function generateLelanationSitemap(): string {
  const config = getLelanationSitemapConfig()
  return generateSitemap(config)
}
