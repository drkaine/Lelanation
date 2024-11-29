<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Filter } from './Filter'
import { useChampionStore } from '@/stores/championStore'
import ChampionTooltip from '@/components/ChampionTooltip.vue'
import version from '@/assets/files/lastVersion.json'

const searchQuery = ref<string>('')
const filterInstance = new Filter()

onMounted(() => {
  filterInstance.filteredChampions.value = filterInstance.championData
})

const filterChampions = (tag: string) => {
  filterInstance.filterChampions(tag)
}

const filterChampionsByName = () => {
  filterInstance.searchQuery = searchQuery.value
  filterInstance.filterChampionsByName()
}

const championStore = useChampionStore()

const selectChampion = (champion: {
  image: { full: string }
  name: string
}) => {
  championStore.selectedChampionImage = champion.image.full
  championStore.selectedChampionName = champion.name
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
          style="position: absolute; left: 384px; top: 169.6px"
        >
          <ChampionTooltip :champion="champion" />
        </div>
      </div>
    </div>
  </div>
</template>
