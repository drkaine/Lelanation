<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dictionnaire from '@/assets/files/dictionnaire.json'
import type { DictionaryEntry } from '@/types/dictionary'

const dictionary = ref<DictionaryEntry>({})
const searchQuery = ref('')
const currentLetter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const filteredDictionary = computed(() => {
  let filtered = { ...dictionary.value }

  if (searchQuery.value) {
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(
        ([key, value]: [string, string]) =>
          key.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          value.toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
    )
  }

  if (currentLetter.value) {
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(([key]) =>
        key.toLowerCase().startsWith(currentLetter.value.toLowerCase()),
      ),
    )
  }

  return filtered
})

const totalPages = computed(() =>
  Math.ceil(Object.keys(filteredDictionary.value).length / itemsPerPage.value),
)

const paginatedDictionary = computed(() => {
  const entries = Object.entries(filteredDictionary.value)
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return Object.fromEntries(entries.slice(start, end))
})

const selectLetter = (letter: string) => {
  currentLetter.value = currentLetter.value === letter ? '' : letter
  currentPage.value = 1
}

const changePage = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  dictionary.value = dictionnaire
})
</script>

<template>
  <div class="dictionary-container">
    <h1 class="title">Dictionnaire Lelandrivien</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un mot..."
        class="search-input"
      />
    </div>

    <div class="alphabet-nav">
      <button
        v-for="letter in alphabet"
        :key="letter"
        :class="['letter-btn', { active: currentLetter === letter }]"
        @click="selectLetter(letter)"
      >
        {{ letter }}
      </button>
    </div>

    <div class="dictionary-content">
      <div
        v-for="(definition, word) in paginatedDictionary"
        :key="word"
        class="dictionary-entry"
      >
        <span class="word">{{ word }}</span>
        <span class="separator">:</span>
        <p class="definition" v-html="definition"></p>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-btn"
      >
        Précédent
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-btn"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
