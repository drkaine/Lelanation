<script setup lang="ts">
import { SEOCanonicalValidator } from '@/utils/seoValidation'

interface StructuredData {
  '@context': string
  '@type': string
  '@id'?: string
  name?: string
  alternateName?: string
  headline?: string
  url?: string
  description?: string
  inLanguage?: string
  datePublished?: string
  dateCreated?: string
  dateModified?: string
  articleSection?: string
  keywords?: string
  mainEntityOfPage?: {
    '@type': string
    '@id': string
  }
  image?:
    | {
        '@type': string
        url: string
        width?: number
        height?: number
        caption?: string
      }
    | string
  author?: {
    '@type': string
    '@id'?: string
    name: string
    url?: string
    sameAs?: string[]
  }
  publisher?: {
    '@type': string
    '@id'?: string
    name: string
    url?: string
    logo?: {
      '@type': string
      url: string
      width?: number
      height?: number
    }
  }
  audience?: {
    '@type': string
    audienceType?: string
  }
  about?: {
    '@type': string
    name?: string
    description?: string
    genre?: string
    publisher?: string
  }
  potentialAction?: {
    '@type': string
    target?: {
      '@type': string
      urlTemplate?: string
    }
    'query-input'?: string
  }
  [key: string]: unknown
}

interface Props {
  title: string
  description: string
  image?: string
  type?: string
  canonical?: string
  structuredData?: StructuredData
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  author?: string
}

const props = withDefaults(defineProps<Props>(), {
  image: '/assets/images/lelariva.png',
  type: 'website',
  canonical: '',
  author: 'Lelariva',
})

const url = window.location.href
const canonicalUrl =
  props.canonical ||
  SEOCanonicalValidator.buildCanonicalUrl(new URL(url).pathname)

if (import.meta.env.DEV) {
  const validation = SEOCanonicalValidator.validateUrl(canonicalUrl)
  if (!validation.isCanonical) {
    console.warn('⚠️ Canonical URL validation issues:', validation.issues)
  }
}
const fullImageUrl = props.image?.startsWith('http')
  ? props.image
  : `https://lelanation.fr${props.image}`

const enhancedStructuredData: StructuredData = {
  '@context': 'https://schema.org',
  '@type': props.type === 'article' ? 'Article' : 'WebPage',
  name: props.title,
  headline: props.title,
  url: canonicalUrl,
  description: props.description,
  inLanguage: 'fr-FR',
  author: {
    '@type': 'Person',
    '@id': 'https://www.lelanation.fr#lelariva',
    name: props.author,
    url: 'https://www.lelanation.fr',
    sameAs: [
      'https://twitter.com/Lelariva_fr',
      'https://www.twitch.tv/lelariva',
      'https://www.youtube.com/@lelariva',
    ],
  },
  publisher: {
    '@type': 'Organization',
    '@id': 'https://www.lelanation.fr#organization',
    name: 'Lelanation',
    url: 'https://www.lelanation.fr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lelanation.fr/assets/images/lelariva.webp',
      width: 300,
      height: 300,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': canonicalUrl,
  },
  image: {
    '@type': 'ImageObject',
    url: fullImageUrl,
    width: 1200,
    height: 630,
    caption: props.title,
  },
  ...(props.publishedTime && {
    datePublished: props.publishedTime,
    dateCreated: props.publishedTime,
  }),
  ...(props.modifiedTime && {
    dateModified: props.modifiedTime,
  }),
  ...(props.type === 'article' && {
    articleSection: props.section || 'League of Legends',
    keywords:
      props.tags?.join(', ') || 'League of Legends, LoL, builds, guides',
  }),
}

const finalStructuredData = props.structuredData || enhancedStructuredData
</script>

<template>
  <vue-helmet>
    <title>{{ props.title }}</title>
    <meta name="title" :content="props.title" />
    <meta name="description" :content="props.description" />
    <link rel="canonical" :href="canonicalUrl" />

    <meta property="og:type" :content="props.type" />
    <meta property="og:site_name" content="Lelanation" />
    <meta property="og:title" :content="props.title" />
    <meta property="og:description" :content="props.description" />
    <meta property="og:image" :content="fullImageUrl" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" :content="`${props.title} - Lelanation`" />
    <meta property="og:url" :content="canonicalUrl" />
    <meta property="og:locale" content="fr_FR" />
    <meta
      property="og:updated_time"
      :content="props.modifiedTime || new Date().toISOString()"
    />

    <template v-if="props.type === 'article'">
      <meta property="article:author" :content="props.author" />
      <meta
        property="article:section"
        :content="props.section || 'League of Legends'"
      />
      <meta
        property="article:published_time"
        :content="props.publishedTime"
        v-if="props.publishedTime"
      />
      <meta
        property="article:modified_time"
        :content="props.modifiedTime"
        v-if="props.modifiedTime"
      />
      <template v-if="props.tags">
        <meta
          property="article:tag"
          v-for="tag in props.tags"
          :key="tag"
          :content="tag"
        />
      </template>
    </template>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Lelariva_fr" />
    <meta name="twitter:creator" content="@Lelariva_fr" />
    <meta name="twitter:title" :content="props.title" />
    <meta name="twitter:description" :content="props.description" />
    <meta name="twitter:image" :content="fullImageUrl" />
    <meta name="twitter:image:alt" :content="`${props.title} - Lelanation`" />
    <meta name="twitter:url" :content="canonicalUrl" />

    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />
    <meta
      name="googlebot"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />
    <meta name="author" :content="props.author" />
    <meta
      name="keywords"
      :content="
        props.tags?.join(', ') ||
        'League of Legends, LoL, builds, guides, Lelariva, gaming, esport, strategy'
      "
    />
    <meta name="language" content="French" />
    <meta name="theme-color" content="#C8941A" />
    <meta name="application-name" content="Lelanation" />

    <link rel="alternate" hreflang="fr" :href="canonicalUrl" />
    <link rel="alternate" hreflang="x-default" :href="canonicalUrl" />

    <script
      type="application/ld+json"
      v-html="JSON.stringify(finalStructuredData)"
    ></script>
  </vue-helmet>
</template>
