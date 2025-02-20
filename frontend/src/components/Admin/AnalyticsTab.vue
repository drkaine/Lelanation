<script setup lang="ts">
import { ref, onMounted } from 'vue'

const analytics = ref({ visiteur: 0 })
const loading = ref(true)
const error = ref('')

const fetchAnalytics = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/analytics')
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

<style scoped>
.analytics-container {
  padding: 1rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-gold-200);
}

.error {
  color: var(--color-error);
}

.stats {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.stat-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

h3 {
  color: var(--color-gold-300);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stat-value {
  font-size: 2rem;
  color: var(--color-gold-100);
  font-family: var(--font-beaufort);
}
</style>
