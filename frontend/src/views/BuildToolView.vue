<script setup lang="ts">
import SheetBuild from '@/components/composants/SheetBuild.vue'
import Extra from '@/components/composants/ExtraInfo.vue'
import MenuBuild from '@/components/composants/MenuBuild.vue'
import ItemsSelection from '@/components/Selection/ItemsSelection.vue'
import ChampSelection from '@/components/Selection/ChampSelection.vue'
import RunesSelection from '@/components/Selection/RunesSelection.vue'
import { useStepStore } from '@/stores/stepStore'
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import BuildRecap from '@/components/composants/BuildRecap.vue'
import InfosBuild from '@/components/composants/InfosBuild.vue'
import version from '@/assets/files/data/lastVersion.json'
import { useSEOHead } from '@/composables/useSEOHead'
import { useRoute } from 'vue-router'

const route = useRoute()
const isEditMode = route.path === '/build/edit'

useSEOHead({
  title: isEditMode
    ? 'Éditeur de Build LoL - Mode Édition'
    : 'Créateur de Build LoL Avancé - Optimisez vos Builds League of Legends',
  description: isEditMode
    ? 'Éditeur de build League of Legends pour modifier vos configurations existantes.'
    : "Utilisez notre créateur de build League of Legends avancé pour optimiser vos stratégies. Sélectionnez champion, runes, objets et sorts d'invocateur avec des recommandations expertes de Lelariva.",
  keywords:
    'créer build LoL, outil build League of Legends, builds personnalisés, runes LoL, optimisation champion, stratégies avancées',
  type: 'article',
  noIndex: isEditMode,
  structuredData: !isEditMode
    ? {
        '@type': 'WebApplication',
        name: 'Créateur de Build League of Legends',
        description:
          'Outil interactif pour créer des builds optimisés pour League of Legends',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
      }
    : undefined,
})

const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()
const stepStore = useStepStore()

const next = () => {
  if (stepStore.step === 'item') {
    stepStore.setStepSelection('info')
  } else {
    stepStore.setStepSelection('item')
  }
}
</script>

<template>
  <div class="window-build">
    <MenuBuild />
    <div class="build">
      <div class="build-content">
        <section aria-labelledby="build-creator-section" class="core-build">
          <div v-if="stepStore.step === 'champion'">
            <ChampSelection />
          </div>
          <div v-else-if="stepStore.step === 'rune'">
            <RunesSelection />
          </div>
          <div v-else-if="stepStore.step === 'item'">
            <ItemsSelection />
          </div>
          <div v-else-if="stepStore.step === 'info'">
            <InfosBuild />
          </div>
          <div v-else-if="stepStore.step === 'build'">
            <BuildRecap />
          </div>
          <button
            class="suivant"
            v-if="stepStore.step === 'rune' || stepStore.step === 'item'"
            @click="next()"
          >
            {{ $t('button.next') }}
          </button>
        </section>

        <section aria-labelledby="build-preview-section" class="sheet-build">
          <SheetBuild
            :version="version"
            :name="null"
            :author="null"
            :description="null"
            :champion="championStore.selectedChampion"
            :runes="runeStore.runesSelection"
            :summoners="summonerStore.summonerSelection"
            :shards="shardStore.shardsSelection"
            :items="itemStore.ItemsSelection"
            :skillOrder="championStore.championSkillsOrder"
          />
          <Extra v-if="itemStore.ItemsSelection.core" />
        </section>
      </div>
    </div>
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

.section-title {
  font-size: var(--title-base);
  color: var(--color-gold-200);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-gold-300);
  text-align: left;
}

.window-build {
  width: var(--width-all);
  height: var(--height-all);
  display: flex;
  flex-direction: column;
}

.build {
  display: flex;
  flex-direction: column;
  width: var(--width-all);
  flex: 1;
}

.build-content {
  display: flex;
  flex-direction: column;
  width: var(--width-all);
}

.core-build {
  width: var(--width-all);
  margin-bottom: 20px;
}

:deep(.runesPage-sheet) {
  width: var(--width-all);
}

@media (min-width: 1060px) {
  .build {
    flex-direction: row;
  }

  .build-content {
    flex-direction: row;
    gap: 16px;
    flex: 1;
  }

  .core-build {
    flex: 1;
    min-width: 0;
  }
}
</style>
