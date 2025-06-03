import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface SEOData {
  title: string
  description: string
  keywords?: string
  image?: string
  type?: string
  canonical?: string
  noIndex?: boolean
  structuredData?: Record<string, unknown>
}

const usedTitles = new Set<string>()
const usedDescriptions = new Set<string>()

export function useSEOHead(data: SEOData) {
  const route = useRoute()
  const baseUrl = 'https://www.lelanation.fr'

  const fullTitle = computed(() => {
    const routePath = route?.path || '/'
    const routeBasedSuffix = getRouteBasedSuffix(routePath)
    const titleWithSuffix =
      data.title + (routeBasedSuffix ? ` ${routeBasedSuffix}` : '')

    if (titleWithSuffix.includes('Lelanation')) {
      return titleWithSuffix
    }
    return `${titleWithSuffix} | Lelanation`
  })

  const fullImageUrl = computed(() => {
    if (!data.image) return `${baseUrl}/assets/images/lelariva.webp`
    if (data.image.startsWith('http')) return data.image
    return `${baseUrl}${data.image}`
  })

  const canonicalUrl = computed(() => {
    if (data.canonical) return data.canonical
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.search = ''
      url.hash = ''
      return url.toString()
    }
    const routePath = route?.path || '/'
    return baseUrl + routePath
  })

  const keywords = computed(() => {
    const baseKeywords =
      'League of Legends, LoL, builds, guides, Lelariva, gaming, esport, strategy'
    if (data.keywords) {
      return `${data.keywords}, ${baseKeywords}`
    }
    return baseKeywords
  })

  const robotsContent = computed(() => {
    if (data.noIndex) return 'noindex, nofollow'
    return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  })

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle.value,
    url: canonicalUrl.value,
    description: data.description,
    author: {
      '@type': 'Person',
      name: 'Lelariva',
      url: 'https://www.lelanation.fr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lelanation',
      url: 'https://www.lelanation.fr',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/images/lelariva.webp`,
      },
    },
    image: fullImageUrl.value,
  }

  const structuredData = computed(() => {
    if (data.structuredData) {
      return { ...defaultStructuredData, ...data.structuredData }
    }
    return defaultStructuredData
  })

  if (import.meta.env.DEV) {
    const routePath = route?.path || '/'
    validateSEOData(data, fullTitle.value, routePath)
  }

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: data.description },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: robotsContent },
      { name: 'author', content: 'Lelariva' },
      { name: 'theme-color', content: '#C8941A' },

      { property: 'og:type', content: data.type || 'website' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: data.description },
      { property: 'og:image', content: fullImageUrl },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: 'Lelanation' },
      { property: 'og:locale', content: 'fr_FR' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: data.description },
      { name: 'twitter:image', content: fullImageUrl },
      { name: 'twitter:site', content: '@lelariva' },
      { name: 'twitter:creator', content: '@lelariva' },

      { name: 'x:card', content: 'summary_large_image' },
      { name: 'x:title', content: fullTitle },
      { name: 'x:description', content: data.description },
      { name: 'x:image', content: fullImageUrl },
      { name: 'x:site', content: '@lelariva' },
      { name: 'x:creator', content: '@lelariva' },
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(structuredData.value),
      },
    ],
  })

  return {
    fullTitle,
    fullImageUrl,
    canonicalUrl,
    structuredData,
  }
}

function validateSEOData(data: SEOData, fullTitle: string, path: string) {
  const warnings: string[] = []

  if (fullTitle.length < 30) {
    warnings.push(
      `[SEO] Titre trop court (${fullTitle.length} caractères) pour ${path}. Recommandé: 30-60 caractères`,
    )
  } else if (fullTitle.length > 60) {
    warnings.push(
      `[SEO] Titre trop long (${fullTitle.length} caractères) pour ${path}. Recommandé: 30-60 caractères`,
    )
  }

  if (data.description.length < 120) {
    warnings.push(
      `[SEO] Description trop courte (${data.description.length} caractères) pour ${path}. Recommandé: 120-160 caractères`,
    )
  } else if (data.description.length > 160) {
    warnings.push(
      `[SEO] Description trop longue (${data.description.length} caractères) pour ${path}. Recommandé: 120-160 caractères`,
    )
  }

  if (usedTitles.has(fullTitle)) {
    warnings.push(`[SEO] Titre dupliqué détecté: "${fullTitle}" pour ${path}`)
  } else {
    usedTitles.add(fullTitle)
  }

  if (usedDescriptions.has(data.description)) {
    warnings.push(`[SEO] Description dupliquée détectée pour ${path}`)
  } else {
    usedDescriptions.add(data.description)
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning))
  }
}

function getRouteBasedSuffix(path: string): string {
  const routeMap: Record<string, string> = {
    '/build': '- Créateur',
    '/builds-publics': '- Communauté',
    '/builds': '- Mes Builds',
    '/dictionnaire': '- Lexique LoL',
    '/statistique': '- Analytics',
    '/videos': '- Shorts Gaming',
  }

  return routeMap[path] || ''
}

export function resetSEOValidation() {
  usedTitles.clear()
  usedDescriptions.clear()
}
