<template>
  <div :itemscope="structured" :itemtype="structuredType">
    <MetaTags
      :title="title"
      :description="description"
      :image="image"
      :type="type"
      :canonical="canonical"
      :structured-data="structuredData"
    />

    <main :role="mainRole" :aria-labelledby="headingId">
      <slot name="header">
        <PageTitle
          :id="headingId"
          :title="title"
          :level="1"
          :structured="structured"
          :class="titleClass"
        />
      </slot>

      <slot />
    </main>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import MetaTags from '@/components/MetaTags.vue'
import PageTitle from '@/components/SEO/PageTitle.vue'
import { computed } from 'vue'

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
  structured?: boolean
  structuredType?: string
  titleClass?: string
  structuredData?: StructuredData
}

const props = withDefaults(defineProps<Props>(), {
  image: '/assets/images/lelariva.png',
  type: 'website',
  structured: true,
  structuredType: 'https://schema.org/WebPage',
  titleClass: 'title',
})

const headingId = computed(
  () => `page-title-${props.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
)
const mainRole = 'main'
</script>

<script lang="ts">
export default {
  name: 'SEOLayout',
}
</script>
