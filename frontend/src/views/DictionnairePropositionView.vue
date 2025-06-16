<script setup lang="ts">
import { ref, computed } from 'vue'

const instanceId = Math.random().toString(36).substr(2, 9)
const pseudoId = computed(() => `pseudo-${instanceId}`)
const wordId = computed(() => `word-${instanceId}`)
const definitionId = computed(() => `definition-${instanceId}`)
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Proposer une Définition Laranguiva | Lelanation',
  description:
    'Proposez de nouvelles définitions pour le dictionnaire Laranguiva. Enrichissez le vocabulaire LoL de la communauté.',
  keywords:
    'dictionnaire laranguiva, proposer définition, vocabulaire LoL, communauté League of Legends, contribution',
  type: 'website',
  noIndex: true,
})

const pseudo = ref('')
const word = ref('')
const definition = ref('')

const urlApiSave = import.meta.env.VITE_URL_API_SAVE

const showPopup = ref(false)
const popupMessage = ref('')
const isError = ref(false)

const showNotification = (message: string, error = false) => {
  popupMessage.value = message
  isError.value = error
  showPopup.value = true
  setTimeout(() => {
    showPopup.value = false
  }, 5000)
}

const submitProposition = async () => {
  try {
    const response = await fetch(`${urlApiSave}/api/dictionnaire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pseudo: pseudo.value,
        word: word.value,
        definition: definition.value,
      }),
    })

    if (!response.ok) throw new Error('Erreur réseau')

    showNotification('Votre proposition a été envoyée avec succès !')
  } catch (error) {
    showNotification("Une erreur est survenue lors de l'envoi", true)
    console.error('Erreur:', error)
  }
}
</script>

<template>
  <div class="dictionary-container">
    <div class="proposition-content">
      <section aria-labelledby="intro-section">
        <h1 class="title">{{ $t('dictionnaire-proposition.title') }}</h1>
        <h2 id="intro-section" class="section-title">
          {{ $t('dictionnaire-proposition.how-it-works') }}
        </h2>
        <p>
          {{ $t('dictionnaire-proposition.explanation') }}
        </p>
      </section>

      <section aria-labelledby="form-section">
        <h2 id="form-section" class="section-title">
          {{ $t('dictionnaire-proposition.form-title') }}
        </h2>

        <form @submit.prevent="submitProposition" class="proposition-form">
          <div class="form-group">
            <label :for="pseudoId">{{
              $t('dictionnaire-proposition.pseudo')
            }}</label>
            <input
              :id="pseudoId"
              v-model="pseudo"
              type="text"
              required
              maxlength="30"
              :placeholder="$t('dictionnaire-proposition.pseudo')"
            />
          </div>

          <div class="form-group">
            <label :for="wordId">{{
              $t('dictionnaire-proposition.word')
            }}</label>
            <input
              :id="wordId"
              v-model="word"
              type="text"
              required
              maxlength="50"
              :placeholder="$t('dictionnaire-proposition.word')"
            />
          </div>

          <div class="form-group">
            <label :for="definitionId">{{
              $t('dictionnaire-proposition.definition')
            }}</label>
            <textarea
              :id="definitionId"
              v-model="definition"
              required
              maxlength="1000"
              :placeholder="$t('dictionnaire-proposition.definition')"
              rows="5"
            />
          </div>

          <button type="submit" class="submit-btn">
            {{ $t('button.submit') }}
          </button>
        </form>
      </section>
    </div>
  </div>
  <Transition name="fade">
    <div v-if="showPopup" class="popup" :class="{ error: isError }">
      {{ popupMessage }}
    </div>
  </Transition>
</template>
