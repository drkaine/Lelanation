<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dictionnaire from '@/assets/files/dictionnaire.json'
import { type DictionaryEntry } from '@/components/script/type'

const dictionary = ref<DictionaryEntry>({})
const searchQuery = ref('')
const currentLetter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10) // Nombre de mots par page (5 par colonne * 2 colonnes)

// Générer l'alphabet
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Filtrer le dictionnaire
const filteredDictionary = computed(() => {
  let filtered = { ...dictionary.value }

  // Filtre par recherche
  if (searchQuery.value) {
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(
        ([key, value]) =>
          key.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          value.toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
    )
  }

  // Filtre par lettre
  if (currentLetter.value) {
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(([key]) =>
        key.toLowerCase().startsWith(currentLetter.value.toLowerCase()),
      ),
    )
  }

  return filtered
})

// Pagination
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
  {{ console.log(paginatedDictionary) }}
  <div class="dictionary-container">
    <h1 class="title">Dictionnaire Lelandriva</h1>

    <!-- Barre de recherche -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un mot..."
        class="search-input"
      />
    </div>

    <!-- Navigation alphabétique -->
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

    <!-- Contenu du dictionnaire -->
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

    <!-- Pagination -->
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

<style scoped>
.dictionary-container {
  background-color: #0a1428;
  min-height: 100vh;
  padding: 2rem;
  color: white;
  width: 100%;
  margin: 0;
}

.title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #c9aa71;
}

.dictionary-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dictionary-entry {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #c9aa71;
  border-radius: 8px;
  background-color: rgba(201, 170, 113, 0.1);
  transition: transform 0.2s ease;
}

.dictionary-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 170, 113, 0.2);
}

.word {
  color: #c9aa71;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: capitalize;
  white-space: nowrap;
}

.separator {
  color: #c9aa71;
  margin: 0 0.5rem;
}

.definition {
  color: #e1e1e1;
  line-height: 1.4;
  font-size: 1rem;
  margin: 0;
}

.definition :deep(a) {
  color: #c9aa71;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.definition :deep(a:hover) {
  color: #e1e1e1;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #c9aa71;
  border-radius: 8px;
  background-color: rgba(201, 170, 113, 0.1);
  color: white;
  font-size: 1rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.alphabet-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.letter-btn {
  padding: 0.5rem 0.8rem;
  border: 1px solid #c9aa71;
  background-color: transparent;
  color: #c9aa71;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.letter-btn:hover {
  background-color: rgba(201, 170, 113, 0.2);
}

.letter-btn.active {
  background-color: #c9aa71;
  color: #0a1428;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #c9aa71;
  background-color: transparent;
  color: #c9aa71;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: rgba(201, 170, 113, 0.2);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #c9aa71;
  font-size: 1rem;
}
</style>
