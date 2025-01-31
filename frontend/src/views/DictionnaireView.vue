<script setup lang="ts">
import { onMounted } from 'vue'
import dictionnaire from '@/assets/files/dictionnaire/dictionnaire.json'
import { useDictionary } from '@/composables/useDictionary'
import AlphabetNav from '@/components/AlphabetNavigation.vue'
import Pagination from '@/components/DictionaryPagination.vue'

const {
  dictionary,
  searchQuery,
  currentLetter,
  currentPage,
  paginatedDictionary,
  totalPages,
} = useDictionary(20)

const selectLetter = (letter: string) => {
  currentLetter.value = currentLetter.value === letter ? '' : letter
  currentPage.value = 1
}

onMounted(() => {
  dictionary.value = dictionnaire
})
</script>

<template>
  <div class="dictionary-container">
    <h1 class="title">Dictionnaire laranguiva</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un mot..."
        class="search-input"
      />
      <a
        class="letter-btn"
        aria-label="Ajouter"
        href="/dictionnaire/proposition"
      >
        +
      </a>
    </div>

    <AlphabetNav :current-letter="currentLetter" @select="selectLetter" />

    <div class="dictionary-content">
      <div
        v-for="(definition, word) in paginatedDictionary"
        :key="word"
        class="dictionary-entry"
      >
        <span class="word">{{ word }}</span>
        <p class="definition" v-html="definition"></p>
      </div>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change="page => (currentPage = page)"
    />
  </div>
</template>
