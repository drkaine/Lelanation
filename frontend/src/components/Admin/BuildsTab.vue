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

<style scoped>
.builds-stats {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-section {
  background: rgba(0, 0, 0, 0.2);
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  padding: 1rem;
}

.stats-section h3 {
  color: var(--color-gold-300);
  margin-bottom: 1rem;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-200);
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.stat-title {
  color: var(--color-gold-200);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: var(--color-gold-300);
  font-size: 1.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
