<script lang="ts">
import { type Video, type Tab } from '@/types/video'
import youtubeData from '@/assets/files/data/youtube.json'

export default {
  name: 'ShortView',
  data() {
    return {
      shorts: [] as Video[],
      loading: false,
      error: null as string | null,
      currentTab: 'all',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 12,
      tabs: [
        { id: 'all', name: 'Tous' },
        { id: 'tierlist', name: 'Tierlist' },
        { id: 'build', name: 'Build' },
        { id: 'debrief', name: 'Debrief' },
      ] as Tab[],
    }
  },
  computed: {
    filteredVideos(): Video[] {
      let filtered = this.shorts

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(video =>
          video.snippet.title.toLowerCase().includes(query),
        )
      }

      if (this.currentTab !== 'all') {
        filtered = filtered.filter(video => {
          const title = video.snippet.title.toLowerCase()
          const description = video.snippet.description.toLowerCase()

          switch (this.currentTab) {
            case 'tierlist':
              return (
                title.includes('tier') ||
                title.includes('tierlist') ||
                description.includes('tierlist')
              )
            case 'build':
              return title.includes('build') || description.includes('build')
            case 'debrief':
              return (
                title.includes('debrief') || description.includes('debrief')
              )
            default:
              return true
          }
        })
      }

      return filtered
    },
    totalPages(): number {
      return Math.ceil(this.filteredVideos.length / this.itemsPerPage)
    },
    paginatedVideos(): Video[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredVideos.slice(start, end)
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    currentTab() {
      this.currentPage = 1
    },
  },
  methods: {
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('fr-FR')
    },

    loadVideos(): void {
      this.loading = true
      try {
        this.shorts = youtubeData.videos
      } catch (err) {
        this.error = 'Erreur lors du chargement des vidéos'
        console.error('Erreur détaillée:', err)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.loadVideos()
  },
}
</script>

<template>
  <div class="shorts-container">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher une vidéo..."
        class="search-input"
      />
      <div v-if="searchQuery" class="search-info">
        Recherche en cours dans toutes les vidéos de la chaîne...
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <div class="shorts-grid">
        <div
          v-for="video in paginatedVideos"
          :key="video.id"
          class="short-card"
        >
          <img :src="video.snippet.thumbnails.medium.url" alt="Miniature" />
          <h3>{{ video.snippet.title }}</h3>
          <p class="video-date">{{ formatDate(video.snippet.publishedAt) }}</p>
          <a :href="`https://youtube.com/watch?v=${video.id}`" target="_blank">
            Voir la vidéo
          </a>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination-button"
        >
          Précédent
        </button>
        
        <!-- Ajout du sélecteur de page -->
        <div class="page-selector-container">
          <select v-model="currentPage" class="page-selector">
            <option v-for="page in totalPages" :key="page" :value="page">
              Page {{ page }}
            </option>
          </select>
        </div>
        
        <span class="page-info">
          sur {{ totalPages }}
        </span>
        
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination-button"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shorts-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.shorts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.short-card {
  background-color: var(--color-gold-50);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
  animation: fadeIn 0.3s ease;
}

.short-card:hover {
  transform: translateY(-4px);
}

.short-card img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.short-card h3 {
  padding: 1rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-blue-400);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-date {
  padding: 0 1rem;
  color: var(--color-gold-100);
  font-size: 0.875rem;
  margin: 0;
}

.short-card a {
  display: block;
  margin: 1rem;
  padding: 0.75rem;
  background-color: var(--color-gold-400);
  color: var(--color-grey-500);
  text-decoration: none;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.short-card a:hover {
  background-color: var(--color-grey-50);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-blue-400);
  font-size: 1.125rem;
}

.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-blue-400);
  background-color: var(--color-grey-50);
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-grey-100);
  color: var(--color-gold-300);
}

.tab-button:hover {
  background-color: var(--color-grey-400);
}

.tab-button.active {
  background-color: var(--color-gold-400);
  color: var(--color-grey-50);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-bar {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-grey-100);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-gold-400);
  box-shadow: 0 0 0 3px rgba(var(--color-gold-400), 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-gold-400);
  color: var(--color-grey-50);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: var(--color-gold-300);
}

.page-selector-container {
  position: relative;
  display: flex;
  align-items: center;
}

.page-selector {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 2px solid var(--color-grey-100);
  border-radius: 0.5rem;
  background-color: var(--color-gold-50);
  color: var(--color-blue-400);
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.3s ease;
}

.page-selector:focus {
  outline: none;
  border-color: var(--color-gold-400);
  box-shadow: 0 0 0 3px rgba(var(--color-gold-400), 0.1);
}

.page-selector-container::after {
  content: "▼";
  position: absolute;
  right: 10px;
  font-size: 0.8rem;
  color: var(--color-gold-300);
  pointer-events: none;
}

.page-info {
  color: var(--color-gold-300);
  font-weight: 500;
  margin-left: 0.5rem;
}

.search-info {
  text-align: center;
  color: var(--color-gold-300);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
