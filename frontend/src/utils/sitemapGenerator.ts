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
  noIndex?: boolean
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

const NOINDEX_ROUTES = [
  '/build/edit',
  '/connexion/*',
  '/admin/*',
  '/dictionnaire/proposition',
  '/statistique',
  '/:pathMatch(.*)*',
  '/seo-audit',
  '/builds',
  '/audit-seo',
]

const NOINDEX_PATTERNS = [
  /^\/connexion\/.+$/,
  /^\/admin\/.+$/,
  /^\/build\/.+\/.+$/,
  /^\/seo-audit$/,
  /^\/audit-seo$/,
  /^\/build\/edit/,
]

export function isNoIndexRoute(path: string): boolean {
  if (
    NOINDEX_ROUTES.some(route => {
      if (route.includes('*')) {
        const pattern = route.replace('*', '.*').replace('/', '\/')
        return new RegExp(`^${pattern}$`).test(path)
      }
      return route === path
    })
  ) {
    return true
  }

  return NOINDEX_PATTERNS.some(pattern => pattern.test(path))
}

export function generateSitemap(config: SitemapConfig, silent = false): string {
  const { baseUrl, routes } = config

  const indexableRoutes = routes.filter(route => {
    if (route.noIndex === true) {
      if (!silent) {
        console.warn(`⚠️ Excluding noindex route from sitemap: ${route.loc}`)
      }
      return false
    }

    if (isNoIndexRoute(route.loc)) {
      if (!silent) {
        console.warn(`⚠️ Excluding noindex route from sitemap: ${route.loc}`)
      }
      return false
    }

    return true
  })

  const urlElements = indexableRoutes
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

  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env?.MODE === 'development'
  ) {
    console.group('🗺️ Sitemap Generation Summary')
    console.log(`✅ Total indexable URLs: ${indexableRoutes.length}`)
    console.log(
      `❌ Excluded noindex URLs: ${routes.length - indexableRoutes.length}`,
    )
    console.groupEnd()
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`
}

export function getLelanationSitemapConfig(): SitemapConfig {
  const baseUrl = 'https://www.lelanation.fr'
  const currentDate = '2025-01-27'

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
      loc: '/lelariva-builds',
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
      changefreq: 'weekly',
      priority: 0.6,
    },
    {
      loc: '/legal',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: '/build/edit',
      lastmod: currentDate,
      changefreq: 'never',
      priority: 0.0,
      noIndex: true,
    },
    {
      loc: '/dictionnaire/proposition',
      lastmod: currentDate,
      changefreq: 'never',
      priority: 0.0,
      noIndex: true,
    },
    {
      loc: '/statistique',
      lastmod: currentDate,
      changefreq: 'never',
      priority: 0.0,
      noIndex: true,
    },
  ]

  return { baseUrl, routes }
}

export function generateLelanationSitemap(silent = false): string {
  const config = getLelanationSitemapConfig()
  return generateSitemap(config, silent)
}

export function validateSitemapForNoIndex(
  sitemap: string,
): Array<{ url: string; issue: string }> {
  const issues: Array<{ url: string; issue: string }> = []

  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g)
  if (!urlMatches) {
    console.warn('⚠️ No URLs found in sitemap')
    return issues
  }

  const totalUrls = urlMatches.length
  console.log(`🔍 Validating ${totalUrls} URLs in sitemap...`)

  urlMatches.forEach(match => {
    const url = match.replace(/<\/?loc>/g, '')
    const path = url.replace('https://www.lelanation.fr', '')

    if (isNoIndexRoute(path)) {
      issues.push({
        url,
        issue: 'URL marked as noindex should not be in sitemap',
      })
    }
  })

  if (issues.length === 0) {
    console.log(`✅ All ${totalUrls} URLs are correctly indexed`)
  }

  return issues
}

export function getAllNoIndexRoutes(): string[] {
  const staticNoIndexRoutes = [
    '/build/edit',
    '/dictionnaire/proposition',
    '/statistique',
    '/seo-audit',
    '/audit-seo',
    '/builds',
    '/connexion/test',
    '/admin/test',
    '/build/ap/test-build',
    '/:pathMatch(.*)*',
  ]

  return staticNoIndexRoutes
}

export function auditSitemapForNoIndexIssues(sitemap: string): {
  validUrls: string[]
  noIndexUrls: string[]
  summary: string
} {
  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || []
  const validUrls: string[] = []
  const noIndexUrls: string[] = []

  urlMatches.forEach(match => {
    const url = match.replace(/<\/?loc>/g, '')
    const path = url.replace('https://www.lelanation.fr', '')

    if (isNoIndexRoute(path)) {
      noIndexUrls.push(url)
    } else {
      validUrls.push(url)
    }
  })

  const summary = `
🔍 Sitemap Audit Results:
  ✅ Valid URLs: ${validUrls.length}
  ❌ NoIndex URLs found: ${noIndexUrls.length}
  📊 Total URLs: ${urlMatches.length}
  
${noIndexUrls.length > 0 ? '⚠️ NoIndex URLs that should be removed:\n' + noIndexUrls.map(url => `   - ${url}`).join('\n') : '✅ No noindex issues found'}
  `

  return { validUrls, noIndexUrls, summary }
}
