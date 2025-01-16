<script setup lang="ts">
import { useBuildStore } from '@/stores/buildStore'
import SheetBuild from '@/components/composants/SheetBuild.vue'

const buildStore = useBuildStore()
buildStore.loadUserBuilds()
const userBuilds = buildStore.userBuilds

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
    const builds = [...userBuilds]
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
  <div data-v-f21e856a="" class="main builds">
    <div data-v-6c16e881="" data-v-f21e856a="" class="builds" id="">
      <h1 data-v-6c16e881="" class="pagetitle">Mes builds</h1>
      <div data-v-6c16e881="" class="settings">
        <div data-v-6c16e881="" class="new">
          <a data-v-6c16e881="" href="/build" class="btn small slate">
            Nouveau Build
          </a>
        </div>
        <!-- <div data-v-6c16e881="" class="compare">
          <button data-v-6c16e881="" class="btn small slate">Comparer</button>
        </div> -->
        <div data-v-6c16e881="" class="order">
          <button data-v-6c16e881="" class="btn small slate">Reordonner</button>
        </div>
      </div>
      <div data-v-6c16e881="" class="list">
        <div
          data-v-04fb255b=""
          data-v-6c16e881=""
          class="build drag"
          v-for="(build, index) in userBuilds"
          :key="build.id"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @drop="handleDrop($event, index)"
          @dragover="handleDragOver"
        >
          <a
            data-v-04fb255b=""
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
              :summonners="build.sheet.summoners"
              :shards="build.sheet.shards"
              :items="build.sheet.items"
              :roles="build.roles"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.builds-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.build-item {
  cursor: grab;
  transition: transform 0.2s;
}

.build-item:active {
  cursor: grabbing;
}

.build-item:hover {
  transform: translateY(-2px);
}
</style>
