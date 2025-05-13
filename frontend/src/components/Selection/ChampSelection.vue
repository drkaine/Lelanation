<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Filter } from '../script/Filter'
import { TooltipCoordonne } from '../script/TooltipCoordonne'
import { useChampionStore } from '@/stores/championStore'

const ChampionTooltip = defineAsyncComponent(
  () => import('@/components/Tooltip/ChampionTooltip.vue'),
)
import type { Champion } from '@/types/champion'
import { useStepStore } from '@/stores/stepStore'

const { locale } = useI18n()
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

watch(
  () => locale.value,
  async _newLocale => {
    console.log(
      `[ChampSelection] Locale changed to: ${_newLocale}, reloading champions`,
    )
    isLoading.value = true
    await championStore.loadChampions()
    await filterInstance.loadChampionData()
    isLoading.value = false
  },
)

onMounted(() => {
  window.addEventListener('languageChanged', async (_event: Event) => {
    console.log(
      `[ChampSelection] Language changed event received:`,
      (_event as CustomEvent).detail,
    )
    isLoading.value = true
    await championStore.loadChampions()
    await filterInstance.loadChampionData()
    isLoading.value = false
  })
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
    <div v-if="isLoading" class="loading-indicator">
      {{ $t('champion.loading') }}...
    </div>
    <div v-else class="list">
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
          {{ $t('champion.assassin') }}
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Fighter'),
          }"
          @click="filterChampions('Fighter')"
        >
          {{ $t('champion.fighter') }}
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Mage'),
          }"
          @click="filterChampions('Mage')"
        >
          {{ $t('champion.mage') }}
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Marksman'),
          }"
          @click="filterChampions('Marksman')"
        >
          {{ $t('champion.marksman') }}
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Support'),
          }"
          @click="filterChampions('Support')"
        >
          {{ $t('champion.support') }}
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.includes('Tank'),
          }"
          @click="filterChampions('Tank')"
        >
          {{ $t('champion.tank') }}
        </button>
        <button
          :class="{
            active: filterInstance.selectedTag.length === 0,
          }"
          @click="filterChampions('')"
        >
          {{ $t('champion.all') }}
        </button>
      </div>

      <div
        class="tooltip"
        v-for="(champion, index) in filterInstance.filteredChampions.value"
        :key="index"
      >
        <button
          class="champ"
          @mouseenter="updateMousePosition"
          @mouseleave="resetMousePosition"
          @click="selectChampion(champion)"
        >
          <img
            loading="lazy"
            width="48"
            height="48"
            decoding="async"
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

<style scoped>
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 1.2rem;
  color: var(--color-gold-200);
}
</style>
