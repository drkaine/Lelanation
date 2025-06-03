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
        style="content-visibility: auto; contain-intrinsic-size: 300px"
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

<style scoped>
.hero-nav {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-link {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.hero-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
}

.hero-link.primary {
  background: linear-gradient(135deg, #c89b3c 0%, #f0e6d2 100%);
  color: #1e1e1e;
  font-weight: 600;
}

.hero-link.primary:hover {
  background: linear-gradient(135deg, #f0e6d2 0%, #c89b3c 100%);
}

.hero-link.featured {
  background: linear-gradient(135deg, #c8aa6e 0%, #463714 100%);
  border-color: #c8aa6e;
}

.hero-link.featured:hover {
  background: linear-gradient(135deg, #463714 0%, #c8aa6e 100%);
}

@media (max-width: 768px) {
  .hero-nav {
    flex-direction: column;
    align-items: center;
  }

  .hero-link {
    width: 100%;
    max-width: 250px;
    text-align: center;
  }
}
</style>
