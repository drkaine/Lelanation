<script lang="ts">
import { type Video, type Tab, type ChannelInfo } from '@/types/video'

import { useSEOHead } from '@/composables/useSEOHead'

export default {
  name: 'ShortView',
  setup() {
    useSEOHead({
      title: 'Vidéos LoL - Shorts et guides League of Legends par Lelariva',
      description:
        'Découvrez les dernières vidéos YouTube de Lelariva : tier lists, builds, guides et analyses League of Legends.',
      keywords:
        'vidéos LoL, YouTube Lelariva, tier list vidéo, guides League of Legends, shorts gaming',
      type: 'article',
      structuredData: {
        '@type': 'VideoGallery',
        name: 'Vidéos Lelariva League of Legends',
        description: 'Collection de vidéos éducatives sur League of Legends',
      },
    })
  },
  data() {
    return {
      shorts: [] as Video[],
      channels: [] as ChannelInfo[],
      loading: false,
      error: null as string | null,
      currentTab: 'all',
      currentChannel: 'all',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 12,
      sortBy: 'date-desc',
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

      if (this.currentChannel !== 'all') {
        filtered = filtered.filter(
          video => video.snippet.channelId === this.currentChannel,
        )
      }

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

      // Tri des vidéos
      switch (this.sortBy) {
        case 'date-desc':
          filtered.sort(
            (a, b) =>
              new Date(b.snippet.publishedAt).getTime() -
              new Date(a.snippet.publishedAt).getTime(),
          )
          break
        case 'date-asc':
          filtered.sort(
            (a, b) =>
              new Date(a.snippet.publishedAt).getTime() -
              new Date(b.snippet.publishedAt).getTime(),
          )
          break
        case 'title-asc':
          filtered.sort((a, b) =>
            a.snippet.title.localeCompare(b.snippet.title),
          )
          break
        case 'title-desc':
          filtered.sort((a, b) =>
            b.snippet.title.localeCompare(a.snippet.title),
          )
          break
        default:
          // Par défaut, tri par date décroissante (plus récent d'abord)
          filtered.sort(
            (a, b) =>
              new Date(b.snippet.publishedAt).getTime() -
              new Date(a.snippet.publishedAt).getTime(),
          )
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
    sortBy() {
      this.currentPage = 1
    },
    itemsPerPage() {
      this.currentPage = 1
    },
  },
  methods: {
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('fr-FR')
    },

    cleanHtmlEntities(text: string): string {
      if (!text) return ''

      return text
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
    },

    async loadVideos(): Promise<void> {
      this.loading = true
      try {
        const youtubeModule = await import('@/assets/files/data/youtube.json')
        this.shorts = youtubeModule.default.videos
        this.channels = youtubeModule.default.channels || []
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
    <h1 class="page-title">{{ $t('navigation.videos') }}</h1>

    <section class="search-section">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une vidéo..."
          class="search-input"
        />
        <select v-model="sortBy" class="sort-select">
          <option value="date-desc">Date (plus récent)</option>
          <option value="date-asc">Date (plus ancien)</option>
          <option value="title-asc">Titre (A-Z)</option>
          <option value="title-desc">Titre (Z-A)</option>
        </select>
        <select v-model="itemsPerPage" class="items-select">
          <option value="6">6 vidéos</option>
          <option value="12">12 vidéos</option>
          <option value="24">24 vidéos</option>
          <option value="48">48 vidéos</option>
        </select>
      </div>
      <div v-if="searchQuery" class="search-info">
        {{ $t('short.search') }}
      </div>
    </section>

    <section class="navigation-section">
      <div v-if="channels.length > 0" class="channel-tabs">
        <h3 class="channel-tabs-title">Chaînes</h3>
        <div class="tabs">
          <button
            :class="['tab-button', { active: currentChannel === 'all' }]"
            @click="currentChannel = 'all'"
          >
            Toutes les chaînes
          </button>
          <button
            v-for="channel in channels"
            :key="channel.channelId"
            :class="[
              'tab-button',
              { active: currentChannel === channel.channelId },
            ]"
            @click="currentChannel = channel.channelId"
          >
            {{ channel.channelName }}
            <span v-if="channel.isComplete" class="complete-badge">✓</span>
          </button>
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
    </section>

    <section class="content-section">
      <div v-if="loading" class="loading">
        {{ $t('short.loading') }}
      </div>

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
            <img
              :src="video.snippet.thumbnails.medium.url"
              :alt="`Miniature vidéo: ${video.snippet.title}`"
            />
            <h2>
              {{ video.snippet.title }} -
              {{ formatDate(video.snippet.publishedAt) }}
            </h2>
            <p class="video-date">
              {{ formatDate(video.snippet.publishedAt) }}
            </p>
            <a
              :href="`https://youtube.com/watch?v=${video.id}`"
              target="_blank"
            >
              {{ $t('short.see-video') }}
            </a>
          </div>
        </div>

        <div class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="pagination-button"
          >
            {{ $t('short.previous') }}
          </button>

          <div class="page-selector-container">
            <select v-model="currentPage" class="page-selector">
              <option v-for="page in totalPages" :key="page" :value="page">
                Page {{ page }}
              </option>
            </select>
          </div>

          <span class="page-info"> sur {{ totalPages }} </span>

          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="pagination-button"
          >
            {{ $t('button.next') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.shorts-container {
  padding: 2rem;
}

.page-title {
  color: var(--color-gold-300);
  font-size: var(--title-base);
  margin: 0 0 2rem 0;
  text-align: center;
}

.section-title {
  color: var(--color-gold-300);
  font-size: var(--title-xs);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-gold-400);
  text-align: left;
}

.search-section,
.navigation-section,
.content-section {
  margin-bottom: 2rem;
}

.shorts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 1.5rem;
  transition: all 0.3s ease;
}

@media (min-width: 1400px) {
  .shorts-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 480px) {
  .shorts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
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

.short-card h2 {
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
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .tabs {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tab-button {
    flex: 1 1 auto;
    min-width: 80px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .tabs {
    gap: 0.25rem;
  }

  .tab-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    flex: 1 1 calc(50% - 0.125rem);
  }
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
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.sort-select,
.items-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-grey-100);
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: var(--color-gold-50);
  color: var(--color-blue-400);
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-width: 160px;
}

.sort-select:focus,
.items-select:focus {
  outline: none;
  border-color: var(--color-gold-400);
  box-shadow: 0 0 0 3px rgba(var(--color-gold-400), 0.1);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-input,
  .sort-select,
  .items-select {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .sort-select,
  .items-select {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    min-width: auto;
  }
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-grey-100);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

@media (max-width: 480px) {
  .search-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    max-width: calc(100vw - 2rem);
  }
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
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .pagination {
    gap: 0.5rem;
    padding: 0.5rem;
    flex-direction: column;
  }

  .pagination-button {
    width: 100%;
    max-width: 120px;
  }

  .page-selector-container {
    width: 100%;
    max-width: 150px;
  }
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
  content: '▼';
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

.channel-tabs {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-grey-100);
}

.channel-tabs-title {
  color: var(--color-gold-300);
  font-size: var(--title-xs);
  margin: 0 0 1rem 0;
  text-align: center;
}

.complete-badge {
  background-color: var(--color-gold-400);
  color: var(--color-grey-50);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  font-weight: bold;
}
</style>
