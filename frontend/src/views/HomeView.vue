<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import SocialLinks from '@/components/home/SocialLinks.vue'
</script>

<template>
  <main class="home-container">
    <HeroSection
      title="Lelandriva vous saluriva tous !"
      subtitle="Retrouver le grand Lelariva"
      imageUrl="/assets/images/lelariva.png"
      imageAlt="Lelariva"
    />
    <SocialLinks />
  </main>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 2rem;
  color: var(--l-gold1);
}
</style>
