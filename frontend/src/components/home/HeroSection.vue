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
      <!-- WebP sources for different screen sizes -->
      <source
        :srcset="
          imageUrl.endsWith('.webp')
            ? imageUrl
            : imageUrl.replace(/\.(png|jpg|jpeg)$/, '.webp')
        "
        type="image/webp"
        media="(min-width: 601px)"
        sizes="300px"
      />
      <source
        :srcset="
          imageUrl.endsWith('.webp')
            ? imageUrl
            : imageUrl.replace(/\.(png|jpg|jpeg)$/, '.webp')
        "
        type="image/webp"
        media="(max-width: 600px)"
        sizes="250px"
      />
      <!-- PNG fallback -->
      <source
        :srcset="
          imageUrl.endsWith('.webp')
            ? imageUrl.replace('.webp', '.png')
            : imageUrl
        "
        type="image/png"
      />
      <img
        class="profil-image"
        :src="
          imageUrl.endsWith('.webp')
            ? imageUrl.replace('.webp', '.png')
            : imageUrl
        "
        :alt="imageAlt"
        itemprop="image"
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        importance="high"
        sizes="(max-width: 600px) 250px, 300px"
                style="
          content-visibility: auto; 
          contain-intrinsic-size: 300px;
        "
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
