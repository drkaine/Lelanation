<script setup lang="ts">
interface Props {
  title: string
  description: string
  image?: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  image: '/assets/images/lelariva.png',
  type: 'website',
})

const url = window.location.href
</script>

<template>
  <vue-helmet>
    <!-- Meta tags de base -->
    <title>{{ props.title }}</title>
    <meta name="description" :content="props.description" />

    <!-- Open Graph -->
    <meta property="og:title" :content="props.title" />
    <meta property="og:description" :content="props.description" />
    <meta property="og:image" :content="props.image" />
    <meta property="og:url" :content="url" />
    <meta property="og:type" :content="props.type" />

    <!-- Twitter -->
    <meta name="twitter:title" :content="props.title" />
    <meta name="twitter:description" :content="props.description" />
    <meta name="twitter:image" :content="props.image" />
    <meta name="twitter:card" content="summary_large_image" />
  </vue-helmet>
</template>
