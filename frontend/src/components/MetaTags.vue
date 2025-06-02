<script setup lang="ts">
import { seoAuditor } from '@/utils/seoAudit'

interface StructuredData {
  '@context': string
  '@type': string
  name?: string
  url?: string
  description?: string
  author?: {
    '@type': string
    name: string
    url?: string
  }
  publisher?: {
    '@type': string
    name: string
    url?: string
    logo?: {
      '@type': string
      url: string
    }
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
}

const props = withDefaults(defineProps<Props>(), {
  image: '/assets/images/lelariva.png',
  type: 'website',
  canonical: '',
})

const url = window.location.href
// Use SEO auditor to get optimal canonical URL
const canonicalUrl = props.canonical || seoAuditor.getOptimalCanonical(url)

// Audit canonical URL for redirects
if (import.meta.env.DEV) {
  seoAuditor.checkCanonicalRedirects(canonicalUrl)
}
const fullImageUrl = props.image?.startsWith('http')
  ? props.image
  : `https://lelanation.fr${props.image}`

// Default structured data
const defaultStructuredData: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Lelanation',
  url: 'https://lelanation.fr',
  description: props.description,
  author: {
    '@type': 'Person',
    name: 'Lelariva',
    url: 'https://lelanation.fr',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Lelanation',
    url: 'https://lelanation.fr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lelanation.fr/assets/images/lelariva.png',
    },
  },
}

const structuredData = props.structuredData || defaultStructuredData
</script>

<template>
  <vue-helmet>
    <title>{{ props.title }}</title>
    <meta name="description" :content="props.description" />
    <link rel="canonical" :href="canonicalUrl" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" :content="props.type" />
    <meta property="og:title" :content="props.title" />
    <meta property="og:description" :content="props.description" />
    <meta property="og:image" :content="fullImageUrl" />
    <meta property="og:url" :content="canonicalUrl" />
    <meta property="og:site_name" content="Lelanation" />
    <meta property="og:locale" content="fr_FR" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" :content="props.title" />
    <meta name="twitter:description" :content="props.description" />
    <meta name="twitter:image" :content="fullImageUrl" />
    <meta name="twitter:site" content="@Lelariva_fr" />
    <meta name="twitter:creator" content="@Lelariva_fr" />

    <!-- Additional SEO Meta Tags -->
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />
    <meta name="author" content="Lelariva" />
    <meta
      name="keywords"
      content="League of Legends, LoL, builds, guides, Lelariva, gaming, esport, strategy"
    />
    <meta name="language" content="French" />
    <meta name="theme-color" content="#C8941A" />

    <!-- Structured Data -->
    <script
      type="application/ld+json"
      v-html="JSON.stringify(structuredData)"
    ></script>
  </vue-helmet>
</template>
