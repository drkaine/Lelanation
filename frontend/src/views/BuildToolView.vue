<script setup lang="ts">
import SheetBuild from '@/components/composants/SheetBuild.vue'
import Extra from '@/components/composants/ExtraInfo.vue'
import MenuBuild from '@/components/composants/MenuBuild.vue'
import ItemsSelection from '@/components/Selection/ItemsSelection.vue'
import ChampSelection from '@/components/Selection/ChampSelection.vue'
import RunesSelection from '@/components/Selection/RunesSelection.vue'
import { useStepStore } from '@/stores/stepStore'
import { useItemStore } from '@/stores/itemStore'
import InfosBuild from '@/components/InfosBuild.vue'

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
  <div data-v-f21e856a="" class="main champions">
    <div data-v-b6709614="" data-v-f21e856a="" class="build">
      <MenuBuild />
      <div data-v-b6709614="" class="main">
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
        <div
          data-v-b6709614=""
          class="next"
          v-if="stepStore.step === 'rune' || stepStore.step === 'item'"
        >
          <button data-v-b6709614="" @click="next()">Next</button>
        </div>
      </div>
      <SheetBuild />
      <Extra v-if="itemStore.ItemsSelection.core" />
    </div>
  </div>
</template>
