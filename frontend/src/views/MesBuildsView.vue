<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SheetBuild from '@/components/composants/SheetBuild.vue'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'
import type { BuildData } from '@/types/build'

const buildStore = useBuildStore()
const route = useRoute()
const builds = ref<BuildData[]>([])
const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const connexionStore = useConnexionStore()

const isLelarivaBuildPage = computed(() =>
  route.path.endsWith('/Lebuildarriva'),
)

onMounted(async () => {
  try {
    const url = isLelarivaBuildPage.value
      ? `${urlApiSave}/api/builds/lelariva`
      : '/assets/build/builds.json'

    const response = await fetch(url)
    const data = await response.json()
    builds.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des builds:', error)
    builds.value = []
  }
})

const filteredBuilds = computed(() => {
  if (isLelarivaBuildPage.value) {
    if (connexionStore.isLoggedIn) {
      return builds.value
    }
    return builds.value.filter(build => !build.id?.startsWith('wait_'))
  }
  return buildStore.userBuilds
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
</script>

<template>
  <div class="main builds">
    <div class="builds" id="">
      <h1 class="pagetitle">
        {{ isLelarivaBuildPage ? 'Builds de Lelariva' : 'Mes builds' }}
      </h1>
      <div class="settings">
        <div class="new">
          <a href="/build" class="btn small slate"> Nouveau Build </a>
        </div>
        <!-- <div  class="compare">
          <button  class="btn small slate">Comparer</button>
        </div> -->
        <div class="order">
          <button class="btn small slate">Reordonner</button>
        </div>
      </div>
      <div class="list">
        <div
          class="build drag"
          v-for="(build, index) in filteredBuilds"
          :key="build.id"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @drop="handleDrop($event, index)"
          @dragover="handleDragOver"
        >
          <a
            aria-current="page"
            :href="`/build/${build.id}`"
            class="router-link-active router-link-exact-active wrap"
          >
            <SheetBuild
              :key="build.id"
              :version="build.version"
              :name="build.name"
              :description="build.description"
              :champion="build.sheet.champion"
              :runes="build.sheet.runes"
              :summoners="build.sheet.summoners"
              :shards="build.sheet.shards"
              :items="build.sheet.items"
              :roles="build.roles ?? null"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
