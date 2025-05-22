<script setup lang="ts">
defineProps<{
  imageUrl: string
  imageAlt: string
}>()
</script>

<template>
  <div class="profil">
    <h1 class="title" itemprop="headline">{{ $t('home.title') }}</h1>
    <picture>
      <source :srcset="imageUrl.replace('.png', '.webp')" type="image/webp" />
      <img
        class="profil-image"
        :src="imageUrl"
        :alt="imageAlt"
        itemprop="image"
        fetchpriority="high"
        width="300"
        height="300"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </picture>
    <h2 class="subtitle" itemprop="alternativeHeadline">
      {{ $t('home.description') }}
    </h2>
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
