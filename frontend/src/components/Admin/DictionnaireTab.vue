<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DictionnaireEntry } from '@/types/dictionary'

const entries = ref<DictionnaireEntry[]>([])
const loading = ref(true)
const error = ref('')

const fetchDictionnaire = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/dictionnaire', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    if (!response.ok)
      throw new Error('Erreur lors de la récupération du dictionnaire')
    entries.value = await response.json()
  } catch {
    error.value = 'Impossible de charger les propositions'
  } finally {
    loading.value = false
  }
}

const handleAction = async (index: number, action: 'approve' | 'reject') => {
  try {
    const entry = entries.value[index]
    const response = await fetch(`/api/dictionnaire/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) throw new Error(`Erreur lors de l'action ${action}`)
    fetchDictionnaire()
  } catch {
    error.value = `Erreur lors de l'action sur la proposition`
  }
}

onMounted(fetchDictionnaire)
</script>

<template>
  <div class="dictionnaire-container">
    <div v-if="loading" class="loading">Chargement des propositions...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="entries">
      <div v-for="(entry, index) in entries" :key="index" class="entry-card">
        <div class="entry-content">
          <h3>Mot : {{ entry.word }} (par {{ entry.pseudo }})</h3>
          <p>Pseudo : {{ entry.pseudo }}</p>
          <p>Définition : {{ entry.definition }}</p>
          <p>Date : {{ entry.date ? entry.date : 'Date non disponible' }}</p>
        </div>

        <div class="entry-actions">
          <button
            @click="handleAction(index, 'approve')"
            class="action-btn approve"
          >
            Valider
          </button>
          <button
            @click="handleAction(index, 'reject')"
            class="action-btn reject"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dictionnaire-container {
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

.entries {
  display: grid;
  gap: 1rem;
}

.entry-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  padding: 1.5rem;
}

.entry-content h3 {
  color: var(--color-gold-300);
  margin-bottom: 0.5rem;
}

.entry-content p {
  color: var(--color-gold-100);
  margin-bottom: 1rem;
}

.entry-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
  text-transform: uppercase;
}

.approve {
  background: var(--color-gold-300);
  color: var(--color-grey-900);
}

.reject {
  background: transparent;
  border: 1px solid var(--color-gold-300);
  color: var(--color-gold-300);
}

.entry-status {
  text-align: right;
  font-weight: bold;
  text-transform: uppercase;
}

.entry-status.approved {
  color: var(--color-gold-300);
}

.entry-status.rejected {
  color: var(--color-gold-300);
}
</style>
