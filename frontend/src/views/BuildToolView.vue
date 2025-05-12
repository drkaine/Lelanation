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
            {{ $t('button.next') }}
          </button>
        </div>
        <div class="sheet-build">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
