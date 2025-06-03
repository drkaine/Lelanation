<script setup lang="ts">
import BuildRecap from '@/components/composants/BuildRecap.vue'
import { useSEOHead } from '@/composables/useSEOHead'
import { useRoute } from 'vue-router'

const route = useRoute()
const buildName = route.params.fileName as string

useSEOHead({
  title: `Build ${buildName} - Guide League of Legends`,
  description: `Découvrez le build ${buildName} pour League of Legends. Guide complet avec runes, objets, sorts et ordre des compétences.`,
  keywords: `build ${buildName}, guide LoL, runes, objets League of Legends`,
  type: 'article',
})
</script>

<template>
  <div>
    <h1 class="visually-hidden">
      Build {{ buildName }} - Guide League of Legends
    </h1>
    <Suspense>
      <template #default>
        <BuildRecap />
      </template>
      <template #fallback>
        <div>{{ $t('build.loading') }}</div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
