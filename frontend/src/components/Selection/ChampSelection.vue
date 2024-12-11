<script setup lang="ts">
import { ref } from 'vue'
import { Filter } from '../script/Filter'
import { useChampionStore } from '@/stores/championStore'
import ChampionTooltip from '@/components/Tooltip/ChampionTooltip.vue'
import version from '@/assets/files/lastVersion.json'
import { type Champion } from '../script/type'
import { useStepStore } from '@/stores/stepStore'

const stepStore = useStepStore()
const searchQuery = ref<string>('')
const filterInstance = new Filter()

const tooltipLeft = ref('0px')
const tooltipTop = ref('0px')

const updateMousePosition = (event: MouseEvent) => {
  const tooltipWidth = 200
  const tooltipHeight = 100

  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()

  const x = rect.left + window.scrollX
  const y = rect.top + window.scrollY

  tooltipLeft.value = x + rect.width + 'px' 
  tooltipTop.value = y + rect.height / 2 - tooltipHeight / 2 + 'px'

  if (parseInt(tooltipLeft.value) + tooltipWidth > window.innerWidth) {
    tooltipLeft.value = x - tooltipWidth - 10 + 'px'
  }

  if (parseInt(tooltipTop.value) + tooltipHeight > window.innerHeight) {
    tooltipTop.value = y - tooltipHeight - 10 + 'px' 
  }

  if (parseInt(tooltipTop.value) < 0) {
    tooltipTop.value = '10px'
  }
}

const resetMousePosition = () => {
  tooltipLeft.value = '0px'
  tooltipTop.value = '0px'
}
const filterChampions = (tag: string) => {
  filterInstance.filterChampions(tag)
}

const filterChampionsByName = () => {
  filterInstance.searchQuery = searchQuery.value
  filterInstance.filterChampionsByName()
}

const championStore = useChampionStore()

const selectChampion = (champion: Champion) => {
  championStore.setSelectedChampion(champion)
  stepStore.setStepSelection('rune')
}
</script>

<template>
  <div data-v-80441127="" data-v-b6709614="" class="champions">
    <div data-v-80441127="" class="list">
      <div data-v-80441127="" class="search">
        <form data-v-80441127="" @submit.prevent>
          <label class="small">
            <input
              placeholder="Search"
              type="search"
              v-model="searchQuery"
              @input="filterChampionsByName"
            />
          </label>
        </form>
      </div>
      <div data-v-80441127="" class="filter">
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Assassin'),
          }"
          @click="filterChampions('Assassin')"
        >
          Assassin
        </button>
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Fighter'),
          }"
          @click="filterChampions('Fighter')"
        >
          Combattant
        </button>
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Mage'),
          }"
          @click="filterChampions('Mage')"
        >
          Mage
        </button>
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Marksman'),
          }"
          @click="filterChampions('Marksman')"
        >
          Tireur
        </button>
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Support'),
          }"
          @click="filterChampions('Support')"
        >
          Support
        </button>
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Tank'),
          }"
          @click="filterChampions('Tank')"
        >
          Tank
        </button>
        <button
          data-v-27037513=""
          data-v-80441127=""
          :class="{
            active: filterInstance.selectedTag.includes('Assassin'),
          }"
          @click="filterChampions('')"
        >
          Tous
        </button>
      </div>

      <div
        data-v-cbff5ddf=""
        data-v-5bc51be1=""
        data-v-80441127=""
        class="tooltip"
        v-for="(champion, index) in filterInstance.championData"
        :key="index"
        @click="selectChampion(champion)"
      >
        <button
          data-v-80441127=""
          data-v-cbff5ddf-s=""
          :class="{
            champ: true,
            hide: !filterInstance.filteredChampions.value.includes(champion),
          }"
          @mouseenter="updateMousePosition"
          @mouseleave="resetMousePosition"
        >
          <img
            data-v-80441127=""
            data-v-cbff5ddf-s=""
            :src="
              'https://ddragon.leagueoflegends.com/cdn/' +
              version +
              '/img/champion/' +
              champion.image.full
            "
            alt="{{champion.name}}"
          />
        </button>
        <div
          data-v-cbff5ddf=""
          class="box"
          :style="{ position: 'absolute', left: tooltipLeft, top: tooltipTop }"
        >
          <ChampionTooltip :champion="champion" />
        </div>
      </div>
    </div>
  </div>
</template>
