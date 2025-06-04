<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SheetBuild from '@/components/composants/SheetBuild.vue'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'
import type { BuildData } from '@/types/build'
import { useSEOHead } from '@/composables/useSEOHead'

const buildStore = useBuildStore()
const route = useRoute()
const builds = ref<BuildData[]>([])
const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const connexionStore = useConnexionStore()
const isLelarivaBuildPage = computed(() =>
  route.path.endsWith('/Lebuildarriva'),
)
const isAdmin = computed(
  () => connexionStore.userName === import.meta.env.VITE_NAME,
)
const selectedRoles = ref(new Set<string>())
const searchType = ref('all')
const searchQuery = ref('')
const visibilityFilter = ref('all')
const certificationFilter = ref('all')

useSEOHead({
  title: 'Mes Builds - Gérer vos builds League of Legends',
  description:
    'Gérez et organisez vos builds League of Legends personnalisés. Visualisez, modifiez et partagez vos créations de builds LoL.',
  keywords:
    'mes builds LoL, gérer builds League of Legends, builds personnalisés, collection builds',
  type: 'article',
})

onMounted(async () => {
  try {
    const url = isLelarivaBuildPage.value
      ? `${urlApiSave}/api/builds/lelariva`
      : `${urlApiSave}/api/builds`

    const response = await fetch(url)
    const data = await response.json()
    builds.value = data
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
  let filtered = isLelarivaBuildPage.value
    ? isAdmin.value
      ? builds.value
      : builds.value.filter(build => !build.id?.startsWith('wait_'))
    : buildStore.userBuilds

  switch (visibilityFilter.value) {
    case 'visible':
      filtered = filtered.filter(build => !build.id?.startsWith('wait_'))
      break
    case 'hidden':
      filtered = filtered.filter(build => build.id?.startsWith('wait_'))
      break
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

  if (selectedRoles.value.size > 0) {
    filtered = filtered.filter(build =>
      build.roles.some(role => selectedRoles.value.has(role)),
    )
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

const handleDragStart = (e: DragEvent, index: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }
}

const handleDrop = (e: DragEvent, dropIndex: number) => {
  e.preventDefault()
  const dragIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1')
  if (dragIndex !== -1 && dragIndex !== dropIndex) {
    const builds = [...filteredBuilds.value]
    const [movedBuild] = builds.splice(dragIndex, 1)
    builds.splice(dropIndex, 0, movedBuild)
    buildStore.updateBuildsOrder(builds)
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const canDragBuild = computed(() => !isLelarivaBuildPage.value || isAdmin.value)
</script>

<template>
  <div class="builds-page">
    <h1 class="page-title">
      {{ isLelarivaBuildPage ? 'Builds de Lelariva' : 'Mes builds' }}
    </h1>

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
          <span class="btn-text">{{ $t('build.new') }}</span>
        </a>

        <select
          v-if="!isLelarivaBuildPage || (isLelarivaBuildPage && isAdmin)"
          v-model="visibilityFilter"
          class="visibility-select"
        >
          <option value="all">{{ $t('button.search.all') }}</option>
          <option value="visible">{{ $t('button.search.public') }}</option>
          <option value="hidden">{{ $t('button.search.private') }}</option>
        </select>

        <select
          v-if="!isLelarivaBuildPage"
          v-model="certificationFilter"
          class="certification-select"
        >
          <option value="all">{{ $t('build.all') }}</option>
          <option value="certified">{{ $t('build.certified') }}</option>
          <option value="uncertified">{{ $t('build.uncertified') }}</option>
        </select>

        <div class="search-box">
          <label for="mes-builds-search-type" class="visually-hidden">{{
            $t('accessibility.search-type')
          }}</label>
          <select
            v-model="searchType"
            id="mes-builds-search-type"
            class="search-type-select"
            :aria-label="$t('accessibility.search-type')"
          >
            <option value="all">{{ $t('button.search.all') }}</option>
            <option value="name">{{ $t('button.search.name') }}</option>
            <option value="champion">{{ $t('button.search.champion') }}</option>
          </select>
          <label for="mes-builds-search-input" class="visually-hidden">{{
            $t('accessibility.search-builds')
          }}</label>
          <input
            v-model="searchQuery"
            id="mes-builds-search-input"
            type="text"
            :placeholder="searchPlaceholder"
            class="search-input"
            :aria-label="$t('accessibility.search-builds')"
          />
        </div>
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
          alt=""
          role="presentation"
        />
        <span class="role-text">{{ role }}</span>
      </button>
    </div>

    <div class="builds-grid">
      <div
        v-for="(build, index) in filteredBuilds"
        :key="build.id"
        class="build-card"
        :draggable="canDragBuild"
        @dragstart="canDragBuild && handleDragStart($event, index)"
        @drop="canDragBuild && handleDrop($event, index)"
        @dragover="canDragBuild && handleDragOver($event)"
        :class="{ 'no-drag': !canDragBuild }"
      >
        <div
          v-if="(isLelarivaBuildPage && isAdmin) || !isLelarivaBuildPage"
          class="visibility-badge"
          :class="{ 'is-hidden': build.id?.startsWith('wait_') }"
        >
          {{ build.id?.startsWith('wait_') ? 'Privé' : 'Public' }}
        </div>
        <router-link
          :to="
            isLelarivaBuildPage
              ? `/build/lelariva/${build.id}`
              : `/build/default/${build.id}`
          "
          class="build-link"
        >
          <SheetBuild
            :version="build.version"
            :name="build.name"
            :author="null"
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
            @certification-toggled="build.certified = !build.certified"
          />
        </router-link>
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

.build-card {
  flex: 0 0 450px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: move;
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
}
</style>
