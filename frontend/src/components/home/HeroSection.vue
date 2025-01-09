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
    <h1 class="title">{{ title }}</h1>
    <img class="profil-image" :src="imageUrl" :alt="imageAlt" />
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.profil {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title {
  font-size: 2.5rem;
  color: var(--l-gold2);
  text-align: center;
}

.profil-image {
  max-width: 300px;
  border: 2px solid var(--l-gold4);
  border-radius: 50%;
  object-fit: cover;
  aspect-ratio: 1;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--l-gold3);
}

@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }

  .profil-image {
    max-width: 250px;
  }
}
</style>
