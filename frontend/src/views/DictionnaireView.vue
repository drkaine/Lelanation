<script setup lang="ts">
import { onMounted } from 'vue'

import { useDictionary } from '@/composables/useDictionary'
import AlphabetNav from '@/components/AlphabetNavigation.vue'
import Pagination from '@/components/DictionaryPagination.vue'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Dictionnaire Lelariva - Vocabulaire League of Legends',
  description:
    'Le dictionnaire officiel de la communauté Lelariva. Découvrez le vocabulaire unique de League of Legends et ses définitions.',
  keywords:
    'dictionnaire LoL, vocabulaire League of Legends, jargon LoL, terminologie gaming, glossaire Lelariva',
  type: 'article',
  structuredData: {
    '@type': 'DefinedTermSet',
    name: 'Dictionnaire Lelariva League of Legends',
    description:
      'Collection de termes et définitions spécifiques à League of Legends',
  },
})

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

onMounted(async () => {
  try {
    const dictionnaireModule = await import(
      '@/assets/files/dictionnaire/dictionnaire.json'
    )
    dictionary.value = dictionnaireModule.default
  } catch (error) {
    console.error('Erreur lors du chargement du dictionnaire:', error)
  }
})
</script>

<template>
  <div class="dictionary-container">
    <h1 class="title">{{ $t('dictionnaire.title') }}</h1>

    <section aria-labelledby="search-section">
      <h2 id="search-section" class="section-title">
        {{ $t('dictionnaire.search-navigation') }}
      </h2>

      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('dictionnaire.search')"
          class="search-input"
        />
        <a
          class="letter-btn"
          aria-label="Ajouter"
          href="/dictionnaire/proposition"
        >
          {{ $t('dictionnaire.add') }}
        </a>
      </div>

      <AlphabetNav :current-letter="currentLetter" @select="selectLetter" />
    </section>

    <section aria-labelledby="definitions-section">
      <h2 id="definitions-section" class="section-title">
        {{ $t('dictionnaire.definitions') }}
      </h2>

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
    </section>
  </div>
</template>
