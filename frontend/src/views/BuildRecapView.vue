<script setup lang="ts">
import BuildRecap from '@/components/composants/BuildRecap.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <BuildRecap />
    </template>
    <template #fallback>
      <div>{{ $t('build.loading') }}</div>
    </template>
  </Suspense>
</template>
