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
    <h1 class="home-title">{{ title }}</h1>
    <img class="profil-image" :src="imageUrl" :alt="imageAlt" />
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>
