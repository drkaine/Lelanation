<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const instanceId = Math.random().toString(36).substr(2, 9)
const searchTypeId = computed(() => `search-type-select-${instanceId}`)
const searchInputId = computed(() => `search-input-${instanceId}`)
import { useRouter } from 'vue-router'
import SheetBuild from '@/components/composants/SheetBuild.vue'
import type { BuildData } from '@/types/build'
import { useSEOHead } from '@/composables/useSEOHead'
import { useGameVersionStore } from '@/stores/gameVersionStore'

const gameVersionStore = useGameVersionStore()

useSEOHead({
  title: 'Builds Communautaires LoL | Guides Champions - Lelanation',
  description:
    'Builds League of Legends communautaires certifiés. Guides champions et stratégies LoL par la communauté francophone.',
  keywords:
    'builds publics LoL, builds communautaires, builds certifiés League of Legends, partage builds, guides champions communauté',
  type: 'article',
  structuredData: {
    '@type': 'CollectionPage',
    name: 'Collection de Builds League of Legends',
    description: 'Builds communautaires certifiés pour League of Legends',
    about: {
      '@type': 'VideoGame',
      name: 'League of Legends',
      genre: 'MOBA',
    },
  },
})

const router = useRouter()
const builds = ref<BuildData[]>([])
const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const selectedRoles = ref(new Set<string>())
const searchType = ref('all')
const searchQuery = ref('')
const certificationFilter = ref('all')
const upToDateFilter = ref(false)

onMounted(async () => {
  try {
    const url = `${urlApiSave}/api/builds`

    const response = await fetch(url)
    const data = await response.json()
    builds.value = data.filter(
      (build: BuildData) => !build.id?.startsWith('wait_'),
    )
  } catch (error) {
    console.error('Erreur lors du chargement des builds:', error)
    builds.value = []
  }
})

const toggleRole = (role: string) => {
  if (selectedRoles.value.has(role)) {
    selectedRoles.value.delete(role)
  } else {
    selectedRoles.value.add(role)
  }
}

const searchPlaceholder = computed(() => {
  switch (searchType.value) {
    case 'name':
      return 'Rechercher par nom de build...'
    case 'champion':
      return 'Rechercher par champion...'
    default:
      return 'Rechercher un build...'
  }
})

const filteredBuilds = computed(() => {
  let filtered = builds.value

  if (selectedRoles.value.size > 0) {
    filtered = filtered.filter(build =>
      build.roles.some(role => selectedRoles.value.has(role)),
    )
  }

  if (certificationFilter.value !== 'all') {
    filtered = filtered.filter(build => {
      if (certificationFilter.value === 'certified') {
        return build.certified === true
      } else {
        return !build.certified
      }
    })
  }

  if (upToDateFilter.value) {
    filtered = filtered.filter(build => {
      const currentVersion = gameVersionStore.currentVersion
      return build.version === currentVersion
    })
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(build => {
      switch (searchType.value) {
        case 'name':
          return build.name.toLowerCase().includes(query)
        case 'champion':
          return build.sheet.champion.name.toLowerCase().includes(query)
        default:
          return (
            build.name.toLowerCase().includes(query) ||
            build.sheet.champion.name.toLowerCase().includes(query)
          )
      }
    })
  }

  return filtered.sort((a, b) => {
    if (!a.version || !b.version) return 0

    const versionA = a.version.split('.').map(Number)
    const versionB = b.version.split('.').map(Number)

    for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
      const numA = versionA[i] || 0
      const numB = versionB[i] || 0

      if (numA !== numB) {
        return numB - numA
      }
    }

    return 0
  })
})

const navigateToBuild = (buildId: string | undefined, event: Event) => {
  if (!buildId) return
  if (
    !event.target ||
    !(event.target as Element).closest('.certification-badge-container')
  ) {
    const cleanBuildId = buildId.endsWith('.json')
      ? buildId.slice(0, -5)
      : buildId
    router.push(`/build/default/${cleanBuildId}`)
  }
}

const hasCertifiedBuilds = computed(() => {
  return builds.value.some(build => build.certified === true)
})
</script>

<template>
  <div class="builds-page">
    <h1 class="page-title">{{ $t('navigation.builds-public') }}</h1>

    <div class="actions">
      <div class="actions-group">
        <a href="/build" class="create-btn">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          <span class="btn-text">{{ $t('button.new-build') }}</span>
        </a>

        <div class="search-box">
          <label :for="searchTypeId" class="visually-hidden">{{
            $t('accessibility.search-type')
          }}</label>
          <select
            v-model="searchType"
            :id="searchTypeId"
            class="search-type-select"
            :aria-label="$t('accessibility.search-type')"
          >
            <option value="all">{{ $t('button.search.all') }}</option>
            <option value="name">{{ $t('button.search.name') }}</option>
            <option value="champion">{{ $t('button.search.champion') }}</option>
          </select>
          <label :for="searchInputId" class="visually-hidden">{{
            $t('accessibility.search-builds')
          }}</label>
          <input
            v-model="searchQuery"
            :id="searchInputId"
            type="text"
            :placeholder="searchPlaceholder"
            class="search-input"
            :aria-label="$t('accessibility.search-builds')"
          />
        </div>

        <select
          v-if="hasCertifiedBuilds"
          v-model="certificationFilter"
          class="certification-select"
        >
          <option value="all">{{ $t('build.all') }}</option>
          <option value="certified">{{ $t('build.certified') }}</option>
          <option value="uncertified">{{ $t('build.uncertified') }}</option>
        </select>

        <label class="up-to-date-toggle">
          <input
            type="checkbox"
            v-model="upToDateFilter"
            class="toggle-checkbox"
          />
          <span class="toggle-slider"></span>
          <span class="toggle-label">{{ $t('build.upToDate') }}</span>
        </label>
      </div>
    </div>

    <div class="role-filters">
      <button
        v-for="role in ['top', 'jungle', 'mid', 'bot', 'support']"
        :key="role"
        class="role-btn"
        :class="{ 'role-inactive': !selectedRoles.has(role) }"
        @click="toggleRole(role)"
      >
        <img
          :src="`/assets/icons/roles/${role}.png`"
          :alt="`Filtrer par rôle ${role}`"
          class="role-icon"
        />
        <span class="role-text">{{ role }}</span>
      </button>
    </div>

    <div class="builds-grid">
      <div v-for="build in filteredBuilds" :key="build.id" class="build-card">
        <SheetBuild
          :version="build.version"
          :name="build.name"
          :author="build.author"
          :description="build.description"
          :champion="build.sheet.champion"
          :runes="build.sheet.runes"
          :summoners="build.sheet.summoners"
          :shards="build.sheet.shards"
          :items="build.sheet.items"
          :roles="build.roles ?? null"
          :skillOrder="build.sheet.skillOrder"
          :certified="build.certified"
          :buildId="build.id"
          :isLelarivaBuild="build.id?.includes('lelariva/')"
          @certification-toggled="build.certified = !build.certified"
          @click="navigateToBuild(build.id, $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  color: var(--color-gold-300);
  font-size: var(--title-base);
  margin: 0 0 2rem 0;
  text-align: center;
}

.btn-text {
  @media (max-width: 768px) {
    display: none;
  }
}

.role-text {
  color: var(--color-gold-200);
  @media (max-width: 768px) {
    display: none;
  }
}

.role-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  color: var(--color-gold-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn img {
  width: 20px;
  height: 20px;
}

.role-btn.role-inactive {
  border-color: var(--color-grey-300);
  color: var(--color-grey-300);
  opacity: 0.7;
}

.role-btn:hover {
  border-color: var(--color-gold-300);
  color: var(--color-gold-300);
  opacity: 1;
}

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.actions-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  max-width: 800px;
  width: var(--width-all);
  justify-content: center;
}

.search-box {
  display: flex;
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: var(--height-all);
}

.search-box option {
  color: var(--color-gold-300);
  background: var(--color-blue-500);
}

.visibility-select {
  background: none;
  height: var(--height-all);
  color: var(--color-gold-300);
  border: var(--border-size) solid var(--color-gold-300);
}

.visibility-select option {
  color: var(--color-gold-300);
  background: var(--color-blue-500);
}

.search-type-select {
  padding: 0.4rem;
  border: none;
  border-right: 2px solid var(--color-grey-300);
  background: none;
  color: var(--color-gold-300);
  cursor: pointer;
  font-size: var(--text-sm);
  min-width: 70px;
}

.search-input {
  flex-grow: 1;
  padding: 0.4rem;
  border: none;
  color: var(--color-gold-300);
}

.role-filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.builds-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 0 1rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.build-card {
  flex: 0 0 450px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.build-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.build-link {
  text-decoration: none;
  color: inherit;
}

.visibility-badge {
  position: absolute;
  top: 1.5rem;
  right: 9.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: 600;
  background: var(--color-gold-300);
  color: var(--color-grey-300);
  z-index: 1;
}

.visibility-badge.is-hidden {
  background: var(--color-grey-300);
  color: var(--color-gold-400);
}

.build-card.no-drag {
  cursor: default;

  &:hover {
    transform: none;
    box-shadow: none;
  }
}

.certification-select {
  background: none;
  height: var(--height-all);
  color: var(--color-gold-300);
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  padding: 0 0.5rem;
  cursor: pointer;
}

.certification-select option {
  color: var(--color-gold-300);
  background: var(--color-blue-500);
}

.up-to-date-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: var(--color-grey-300);
  border-radius: 12px;
  border: 1px solid var(--color-gold-300);
  transition: all 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background-color: var(--color-gold-300);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-checkbox:checked + .toggle-slider {
  background-color: var(--color-gold-300);
}

.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(20px);
  background-color: var(--color-grey-800);
}

.toggle-label {
  color: var(--color-gold-300);
  font-size: var(--text-sm);
  font-weight: 500;
}

.up-to-date-toggle:hover .toggle-slider {
  border-color: var(--color-gold-400);
}

@media (max-width: 768px) {
  .actions-group {
    flex-direction: column;
    width: var(--width-all);
  }

  .visibility-badge {
    top: 0.5rem;
    right: 6.5rem;
    padding: 0.15rem 0.5rem;
  }

  .search-box,
  .visibility-select,
  .create-btn {
    width: var(--width-all);
    height: 30px;
  }

  .btn-text {
    display: inline;
  }

  .role-filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0 1rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .role-filters::-webkit-scrollbar {
    display: none;
  }

  .role-filters {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.5rem;
    margin: 1rem 0;
  }

  .role-btn {
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .role-btn img {
    width: 24px;
    height: 24px;
  }

  .builds-grid {
    margin-top: 1rem;
  }

  .builds-grid {
    gap: 1rem;
    padding: 0 0.5rem;
  }

  .build-card {
    flex: 0 0 100%;
  }

  .role-btn {
    padding: 0.3rem;
  }

  .role-btn img {
    width: 18px;
    height: 18px;
  }

  .visibility-select {
    width: var(--width-all);
    margin: 0.5rem 0;
  }

  .up-to-date-toggle {
    width: var(--width-all);
    justify-content: space-between;
    padding: 0.5rem;
    border: 1px solid var(--color-gold-300);
    border-radius: 4px;
    margin: 0.5rem 0;
  }
}
</style>
