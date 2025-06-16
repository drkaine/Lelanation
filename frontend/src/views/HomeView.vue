<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import SocialLinks from '@/components/home/SocialLinks.vue'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title:
    'Lelanation - Builds et Guides League of Legends par Lelariva | Communauté LoL Francophone',
  description:
    'Découvrez Lelanation, la plateforme française de référence pour créer et partager vos builds League of Legends. Guides exclusifs de Lelariva, stratégies optimisées, et communauté active pour maîtriser LoL.',
  keywords:
    'builds LoL, guides League of Legends, champion builds, tier list, Lelariva, communauté LoL française, stratégies gaming',
  type: 'website',
  structuredData: {
    '@type': 'WebSite',
    mainEntity: {
      '@type': 'Person',
      name: 'Lelariva',
      jobTitle: 'Expert League of Legends',
      description:
        "Créateur de contenu et expert stratégique League of Legends spécialisé dans l'optimisation des builds et guides de gameplay",
      sameAs: [
        'https://x.com/Lelariva_fr',
        'https://www.youtube.com/@Lelariva_LoL/featured',
        'https://www.instagram.com/Lelariva_fr',
        'https://www.twitch.tv/lelariva',
        'https://discord.com/invite/RrXCpsFGrw',
        'https://www.tiktok.com/@lelariva_fr',
        'https://www.patreon.com/c/Lelariva/posts',
      ],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target:
        'https://www.lelanation.fr/builds-publics?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lelanation',
      url: 'https://www.lelanation.fr',
      sameAs: [
        'https://x.com/Lelariva_fr',
        'https://www.youtube.com/@Lelariva_LoL/featured',
        'https://www.instagram.com/Lelariva_fr',
        'https://www.twitch.tv/lelariva',
        'https://discord.com/invite/RrXCpsFGrw',
        'https://www.tiktok.com/@lelariva_fr',
      ],
    },
  },
})
</script>

<template>
  <main class="home-container">
    <HeroSection
      imageUrl="/assets/images/lelariva.webp"
      imageAlt="Portrait de Lelariva, expert League of Legends"
    />
    <SocialLinks />
  </main>
</template>
