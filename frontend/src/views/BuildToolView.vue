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
        <div class="core-build">
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
            Suivant
          </button>
        </div>
        <div class="sheet-build">
          <SheetBuild
            :version="null"
            :name="null"
            :description="null"
            :champion="championStore.selectedChampion"
            :runes="runeStore.runesSelection"
            :summonners="summonerStore.summonerSelection"
            :shards="shardStore.shardsSelection"
            :items="itemStore.ItemsSelection"
          />
          <Extra v-if="itemStore.ItemsSelection.core" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.window-build {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.build {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}

.build-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Mobile par défaut */
.core-build {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.runesPage-sheet) {
  width: 100%;
}

/* Tablette et Desktop */
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
