<script setup lang="ts">
import { ref, onMounted } from 'vue'

const analytics = ref({ visiteur: 0 })
const loading = ref(true)
const error = ref('')

const fetchAnalytics = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/analytics', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    if (!response.ok)
      throw new Error('Erreur lors de la récupération des données')

    analytics.value = await response.json()
  } catch {
    error.value = 'Impossible de charger les statistiques'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnalytics)
</script>

<template>
  <div class="analytics-container">
    <div v-if="loading" class="loading">Chargement des statistiques...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="stats">
      <div class="stat-card">
        <h3>Nombre de visiteurs</h3>
        <div class="stat-value">{{ analytics.visiteur }}</div>
      </div>
    </div>
  </div>
</template>
