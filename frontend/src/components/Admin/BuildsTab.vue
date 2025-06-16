<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BuildData } from '@/types/build'

const communityBuilds = ref<BuildData[]>([])
const lelarivaBuilds = ref<BuildData[]>([])
const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const buildStats = ref({
  public: 0,
  private: 0,
  lelarivaPublic: 0,
  lelarivaPrivate: 0,
})

const fetchBuilds = async () => {
  try {
    const communityResponse = await fetch(`${urlApiSave}/api/builds`)
    const communityData = await communityResponse.json()
    communityBuilds.value = communityData

    const lelarivaResponse = await fetch(`${urlApiSave}/api/builds/lelariva`)
    const lelarivaData = await lelarivaResponse.json()
    lelarivaBuilds.value = lelarivaData

    buildStats.value = {
      public: communityBuilds.value.filter(
        build => !build.id?.startsWith('wait_'),
      ).length,
      private: communityBuilds.value.filter(build =>
        build.id?.startsWith('wait_'),
      ).length,
      lelarivaPublic: lelarivaBuilds.value.filter(build => build.visible)
        .length,
      lelarivaPrivate: lelarivaBuilds.value.filter(build => !build.visible)
        .length,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des builds:', error)
  }
}

onMounted(fetchBuilds)
</script>

<template>
  <div class="builds-stats">
    <div class="stats-section">
      <h3>Builds Communauté</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">Publics</div>
          <div class="stat-value">{{ buildStats.public }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Privés</div>
          <div class="stat-value">{{ buildStats.private }}</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>Builds Lelariva</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">Publics</div>
          <div class="stat-value">{{ buildStats.lelarivaPublic }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Privés</div>
          <div class="stat-value">{{ buildStats.lelarivaPrivate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
