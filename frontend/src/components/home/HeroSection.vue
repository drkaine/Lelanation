<script setup lang="ts">
defineProps<{
  imageUrl: string
  imageAlt: string
}>()
</script>

<template>
  <div class="profil">
    <h1 class="title" itemprop="headline">{{ $t('home.title') }}</h1>

    <div class="image-container">
      <img
        class="profil-image"
        src="/assets/images/lelariva.webp"
        srcset="
          /assets/images/lelariva.webp 400w,
          /assets/images/lelariva.webp 300w,
          /assets/images/lelariva.webp 250w,
          /assets/images/lelariva.webp 200w
        "
        sizes="(max-width: 480px) 200px, (max-width: 768px) 250px, 300px"
        :alt="imageAlt"
        itemprop="image"
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        width="300"
        height="300"
        style="
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          will-change: transform;
          contain: layout style paint;
          image-rendering: optimizeQuality;
        "
      />
    </div>

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

<style scoped>
.profil {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  contain: layout;
  transform: translateZ(0);
  will-change: auto;
  backface-visibility: hidden;
  padding: 2rem 1rem;
}

.title {
  font-family: var(--font-beaufort);
  font-size: var(--title-lg);
  font-weight: 700;
  color: var(--color-gold-300);
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  contain: layout style;
}

.image-container {
  margin-bottom: 1.5rem;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profil-image {
  max-width: 300px;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border: var(--border-size) solid var(--color-gold-400);
  border-radius: 50%;
  background-color: var(--color-blue-600);
  min-height: 250px;
  will-change: transform;
  contain: layout style paint;
  transform: translateZ(0);
  backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimizeQuality;
  transition: transform 0.3s ease;
}

.profil-image:hover {
  transform: translateZ(0) scale(1.05);
}

.subtitle {
  font-family: var(--font-spiegel);
  font-size: var(--title-sm);
  color: var(--color-gold-300);
  contain: layout style;
  will-change: auto;
  text-align: center;
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .profil {
    padding: 1rem 0.5rem;
    contain: layout;
    transform: translateZ(0);
  }

  .title {
    font-size: var(--title-base);
    contain: layout style;
    margin-bottom: 1rem;
  }

  .image-container {
    width: 250px;
    height: 250px;
  }

  .profil-image {
    max-width: 250px;
    width: 100%;
    min-height: 200px;
    contain-intrinsic-size: 250px;
  }

  .subtitle {
    margin-bottom: 1.5rem;
  }

  .nav-link {
    flex: 1 1 100%;
    min-width: auto;
    font-size: var(--text-xs);
    padding: 0.7rem 1rem;
  }
}

@media (max-width: 480px) {
  .image-container {
    width: 200px;
    height: 200px;
  }

  .profil-image {
    max-width: 200px;
    min-height: 180px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profil-image {
    transition: none;
  }

  .profil-image:hover {
    transform: translateZ(0);
  }
}
</style>
