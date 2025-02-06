<template>
  <div class="admin-container">
    <h1>Administration</h1>

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const message = ref('')
const messageType = ref('')

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
    const response = await fetch('/api/upload/ods', {
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

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1,
h2 {
  color: var(--color-gold-300);
}

.upload-section {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  color: var(--color-gold-50);
}

.file-info {
  color: var(--color-gold-200);
  font-size: 0.9rem;
}

.upload-button {
  background: var(--color-gold-300);
  color: black;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.upload-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-message {
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
}

.upload-message.success {
  background: rgba(0, 255, 0, 0.1);
  color: #4caf50;
  border: 1px solid #4caf50;
}

.upload-message.error {
  background: rgba(255, 0, 0, 0.1);
  color: #f44336;
  border: 1px solid #f44336;
}
</style>
