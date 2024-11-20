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
  <div data-v-6024a556="" data-v-c3d704f8="" class="champions">
    <div data-v-6024a556="" class="list">
      <div data-v-6024a556="" class="search">
        <form @submit.prevent data-v-6024a556="">
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
      <div data-v-6024a556="" class="filter">
        <button
          data-v-27037513=""
          data-v-6024a556=""
          :class="{
            selected: filterInstance.selectedTag.includes('Assassin'),
          }"
          @click="filterChampions('Assassin')"
        >
          Assassin
        </button>
        <button
          data-v-27037513=""
          data-v-6024a556=""
          :class="{
            selected: filterInstance.selectedTag.includes('Fighter'),
          }"
          @click="filterChampions('Fighter')"
        >
          Combattant
        </button>
        <button
          data-v-27037513=""
          data-v-6024a556=""
          :class="{
            selected: filterInstance.selectedTag.includes('Mage'),
          }"
          @click="filterChampions('Mage')"
        >
          Mage
        </button>
        <button
          data-v-27037513=""
          data-v-6024a556=""
          :class="{
            selected: filterInstance.selectedTag.includes('Marksman'),
          }"
          @click="filterChampions('Marksman')"
        >
          Tireur
        </button>
        <button
          data-v-27037513=""
          data-v-6024a556=""
          :class="{
            selected: filterInstance.selectedTag.includes('Support'),
          }"
          @click="filterChampions('Support')"
        >
          Support
        </button>
        <button
          data-v-27037513=""
          data-v-6024a556=""
          :class="{
            selected: filterInstance.selectedTag.includes('Tank'),
          }"
          @click="filterChampions('Tank')"
        >
          Tank
        </button>
        <button
          data-v-27037513=""
          data-v-6024a556=""
          @click="filterChampions('')"
        >
          Tous
        </button>
      </div>

      <div
        data-v-de17e6dc=""
        data-v-45896cfe=""
        data-v-6024a556=""
        class="tooltip"
        v-for="(champion, index) in filterInstance.filteredChampions.value"
        :key="index"
        @click="selectChampion(champion)"
      >
        <button data-v-6024a556="" data-v-de17e6dc-s="" class="champ">
          <img
            data-v-6024a556=""
            data-v-de17e6dc-s=""
            :src="
              'https://ddragon.leagueoflegends.com/cdn/' +
              version +
              '/img/champion/' +
              champion.image.full
            "
            alt="{{champion.name}}"
          />
        </button>
        <ChampionTooltip
          :champion="{
            image: { full: champion.image.full },
            name: champion.name,
            title: champion.title,
            tags: champion.tags,
            passive: {
              image: { full: champion.passive.image.full },
              description: champion.passive.description,
            },
            spells: champion.spells,
            info: [
              {
                attack: champion.info.attack.toString(),
                magic: champion.info.magic.toString(),
                defense: champion.info.defense.toString(),
                difficulty: champion.info.difficulty.toString(),
              },
            ],
          }"
        />
      </div>
    </div>
  </div>
</template>
