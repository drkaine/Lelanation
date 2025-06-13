import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { watch, computed } from 'vue'

export interface SEOHeadOptions {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonical?: string
  type?: 'website' | 'article' | 'profile'
  structuredData?: Record<string, unknown>
  noIndex?: boolean
}

export function useSEOHead(options: SEOHeadOptions = {}) {
  const route = useRoute()

  const canonicalUrl = computed(() => {
    if (options.canonical) return options.canonical
    const path = route?.path || '/'
    return `https://www.lelanation.fr${path}`
  })

  const routeSuffix = computed(() => {
    const path = route?.path || '/'
    const suffixes: Record<string, string> = {
      '/': '',
      '/build': 'Créateur',
      '/builds': 'Personnel',
      '/builds-publics': 'Communauté',
      '/lelariva-builds': 'Lelariva builds',
      '/videos': 'Vidéos',
      '/legal': 'Légal',
    }
    return suffixes[path] || ''
  })

  const optimizedTitle = computed(() => {
    if (!options.title) return 'Lelanation - League of Legends'

    const suffix = routeSuffix.value
    const hasLelanation = options.title.includes('Lelanation')

    if (suffix && !hasLelanation) {
      return `${options.title} - ${suffix} | Lelanation`
    }
    return options.title
  })

  const updateHead = () => {
    useHead({
      title: optimizedTitle.value,
      meta: [
        {
          name: 'description',
          content:
            options.description ||
            'Découvrez les meilleurs builds League of Legends avec Lelanation',
        },
        ...(options.keywords
          ? [
              {
                name: 'keywords',
                content: options.keywords,
              },
            ]
          : []),
        {
          name: 'author',
          content: 'Lelariva - Expert League of Legends',
        },
        {
          property: 'og:title',
          content: optimizedTitle.value,
        },
        {
          property: 'og:description',
          content:
            options.description ||
            'Découvrez les meilleurs builds League of Legends avec Lelanation',
        },
        {
          property: 'og:url',
          content: canonicalUrl.value,
        },
        {
          property: 'og:type',
          content: options.type || 'website',
        },
        ...(options.ogImage
          ? [
              {
                property: 'og:image',
                content: options.ogImage,
              },
            ]
          : []),
        {
          name: 'twitter:title',
          content: optimizedTitle.value,
        },
        {
          name: 'twitter:description',
          content:
            options.description ||
            'Découvrez les meilleurs builds League of Legends avec Lelanation',
        },
        ...(options.noIndex
          ? [{ name: 'robots', content: 'noindex, nofollow' }]
          : [
              {
                name: 'robots',
                content: 'index, follow, max-image-preview:large',
              },
            ]),
      ],
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl.value,
        },
      ],
      ...(options.structuredData
        ? {
            script: [
              {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(options.structuredData),
              },
            ],
          }
        : {}),
    })
  }

  watch(
    () => route?.path,
    () => updateHead(),
    { immediate: true },
  )

  if (import.meta.env.MODE === 'development') {
    watch(
      optimizedTitle,
      newTitle => {
        if (newTitle.length < 30 || newTitle.length > 60) {
          console.warn(
            `⚠️ SEO Warning: Title length is ${newTitle.length} characters. Recommended: 30-60 characters.`,
          )
        }
      },
      { immediate: true },
    )

    watch(
      () => options.description,
      newDesc => {
        if (newDesc && (newDesc.length < 120 || newDesc.length > 160)) {
          console.warn(
            `⚠️ SEO Warning: Description length is ${newDesc.length} characters. Recommended: 120-160 characters.`,
          )
        }
      },
      { immediate: true },
    )
  }

  return {
    canonicalUrl: canonicalUrl.value,
    optimizedTitle: optimizedTitle.value,
    updateHead,
  }
}
