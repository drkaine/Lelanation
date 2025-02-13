<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  imageUrl: string
  imageAlt: string
}>()
</script>

<template>
  <div class="profil">
    <h1 class="title" itemprop="headline">{{ title }}</h1>
    <img
      class="profil-image"
      :src="imageUrl"
      :alt="imageAlt"
      loading="lazy"
      itemprop="image"
      fetchpriority="high"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
    <h2 class="subtitle" itemprop="alternativeHeadline">{{ subtitle }}</h2>
    <div itemscope itemtype="http://schema.org/WebSite">
      <meta itemprop="url" content="https://lelanation.fr/" />
      <meta itemprop="name" content="Lelanation" />
      <meta
        itemprop="description"
        content="Plateforme de builds et guides League of Legends par la communauté Lelariva"
      />
    </div>
  </div>
</template>
