<script setup lang="ts">
import BuildRecap from '@/components/composants/BuildRecap.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <BuildRecap />
    </template>
    <template #fallback>
      <div>Chargement...</div>
    </template>
  </Suspense>
</template>
