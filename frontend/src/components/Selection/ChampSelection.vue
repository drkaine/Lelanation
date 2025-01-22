<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { Filter } from '../script/Filter'
import { TooltipCoordonne } from '../script/TooltipCoordonne'
import { useChampionStore } from '@/stores/championStore'

const ChampionTooltip = defineAsyncComponent(
  () => import('@/components/Tooltip/ChampionTooltip.vue'),
)
import type { Champion } from '@/types/champion'
import { useStepStore } from '@/stores/stepStore'

const stepStore = useStepStore()
const searchQuery = ref<string>('')
const filterInstance = new Filter()
const tooltip = new TooltipCoordonne()

const tooltipLeft = tooltip.tooltipLeft
const tooltipTop = tooltip.tooltipTop

const updateMousePosition = (event: MouseEvent) => {
  tooltip.updateMousePosition(event)
}

const resetMousePosition = () => {
  tooltip.resetMousePosition()
}

const filterChampionsByName = () => {
  filterInstance.searchQuery = searchQuery.value
  filterInstance.filterChampionsByName()
}

const championStore = useChampionStore()
const isLoading = ref(true)

onMounted(async () => {
  await championStore.loadChampions()
  isLoading.value = false
})

const filterChampions = (tag: string) => {
  filterInstance.filterChampions(tag)
}

const selectChampion = (champion: Champion) => {
  championStore.setSelectedChampion(champion)
  stepStore.setStepSelection('rune')
}
</script>

<template>
  <div class="championsPage">
    <div class="list">
      <div class="search">
        <form @submit.prevent>
          <label class="small">
            <input
              class="search-input"
              placeholder="Rechercher un champion"
              type="search"
              v-model="searchQuery"
              @input="filterChampionsByName"
            />
          </label>
        </form>
      </div>
      <div class="filter">
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Assassin'),
          }"
          @click="filterChampions('Assassin')"
        >
          Assassin
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Fighter'),
          }"
          @click="filterChampions('Fighter')"
        >
          Combattant
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Mage'),
          }"
          @click="filterChampions('Mage')"
        >
          Mage
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Marksman'),
          }"
          @click="filterChampions('Marksman')"
        >
          Tireur
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Support'),
          }"
          @click="filterChampions('Support')"
        >
          Support
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Tank'),
          }"
          @click="filterChampions('Tank')"
        >
          Tank
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Assassin'),
          }"
          @click="filterChampions('')"
        >
          Tous
        </button>
      </div>

      <div
        class="tooltip"
        v-for="(champion, index) in filterInstance.championData"
        :key="index"
      >
        <button
          :class="{
            champ: true,
            hide: !filterInstance.filteredChampions.value.includes(champion),
          }"
          @mouseenter="updateMousePosition"
          @mouseleave="resetMousePosition"
          @click="selectChampion(champion)"
        >
          <img
            loading="lazy"
            :src="'/assets/icons/champions/' + champion.image.full"
            :alt="champion.name"
          />
        </button>
        <div
          class="box"
          :style="{ position: 'absolute', left: tooltipLeft, top: tooltipTop }"
        >
          <ChampionTooltip :champion="champion" />
        </div>
      </div>
    </div>
  </div>
</template>
