<script setup lang="ts">
import { ref } from 'vue'

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
      <div class="explanation">
        <h1 class="title">{{ $t('dictionnaire-proposition.title') }}</h1>
        <p>
          {{ $t('dictionnaire-proposition.explanation') }}
        </p>
      </div>

      <form @submit.prevent="submitProposition" class="proposition-form">
        <div class="form-group">
          <label for="pseudo">{{
            $t('dictionnaire-proposition.pseudo')
          }}</label>
          <input
            id="pseudo"
            v-model="pseudo"
            type="text"
            required
            maxlength="30"
            :placeholder="$t('dictionnaire-proposition.pseudo')"
          />
        </div>

        <div class="form-group">
          <label for="word">{{ $t('dictionnaire-proposition.word') }}</label>
          <input
            id="word"
            v-model="word"
            type="text"
            required
            maxlength="50"
            :placeholder="$t('dictionnaire-proposition.word')"
          />
        </div>

        <div class="form-group">
          <label for="definition">{{
            $t('dictionnaire-proposition.definition')
          }}</label>
          <textarea
            id="definition"
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
    </div>
  </div>
  <Transition name="fade">
    <div v-if="showPopup" class="popup" :class="{ error: isError }">
      {{ popupMessage }}
    </div>
  </Transition>
</template>
