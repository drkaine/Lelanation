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
