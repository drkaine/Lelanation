<script setup lang="ts">
import { ref } from 'vue'
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const message = ref('')
const messageType = ref('')
const selectedList = ref<'normal' | 'bronze' | 'pro'>('normal')

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    message.value = ''
  }
}

const handleSubmit = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  isUploading.value = true
  message.value = ''

  try {
    const response = await fetch(`/api/upload/ods/${selectedList.value}`, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Erreur lors de l'upload")
    }

    message.value = 'Fichier importé avec succès'
    messageType.value = 'success'
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    message.value =
      error instanceof Error ? error.message : "Erreur lors de l'upload"
    messageType.value = 'error'
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="list-type-tabs">
    <button
      v-for="type in ['normal', 'bronze', 'pro']"
      :key="type"
      :class="{ active: selectedList === type }"
      @click="selectedList = type as 'normal' | 'bronze' | 'pro'"
    >
      {{
        type === 'normal'
          ? 'TIER-LISTE'
          : type === 'bronze'
            ? 'BRONZE-LISTE'
            : 'PRO-LISTE'
      }}
    </button>
  </div>
  <div class="upload-section">
    <h2>Import Tierlist</h2>
    <form @submit.prevent="handleSubmit" class="upload-form">
      <div class="file-input-wrapper">
        <input
          type="file"
          ref="fileInput"
          accept=".ods"
          @change="handleFileChange"
          class="file-input"
        />
        <div class="file-info" v-if="selectedFile">
          Fichier sélectionné: {{ selectedFile.name }}
        </div>
      </div>

      <div class="upload-actions">
        <button
          type="submit"
          :disabled="!selectedFile || isUploading"
          class="upload-button"
        >
          {{ isUploading ? 'Envoi en cours...' : 'Importer' }}
        </button>
      </div>

      <div v-if="message" :class="['upload-message', messageType]">
        {{ message }}
      </div>
    </form>
  </div>
</template>
