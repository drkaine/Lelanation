<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const instanceId = Math.random().toString(36).substr(2, 9)
const filenameId = computed(() => `filename-${instanceId}`)

const activeTab = ref<'upload' | 'gestion'>('upload')
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const fileName = ref('')
const isUploading = ref(false)
const message = ref('')
const messageType = ref('')
const selectedList = ref<'normal' | 'bronze' | 'pro'>('normal')
const tierLists = ref<Record<string, string[]>>({})
const isLoading = ref(false)

const fetchTierLists = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/api/tierlist/all', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    if (!response.ok)
      throw new Error('Erreur lors de la récupération des listes')
    tierLists.value = await response.json()
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTierLists)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    fileName.value = input.files[0].name
    message.value = ''
  }
}

const handleSubmit = async () => {
  if (!selectedFile.value || !fileName.value.trim()) {
    message.value = 'Veuillez sélectionner un fichier et spécifier un nom'
    messageType.value = 'error'
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('fileName', fileName.value.trim())

  isUploading.value = true
  message.value = ''

  try {
    const response = await fetch(`/api/tierlist/upload/${selectedList.value}`, {
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
    fileName.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    await fetchTierLists()
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    message.value =
      error instanceof Error ? error.message : "Erreur lors de l'upload"
    messageType.value = 'error'
    setTimeout(() => {
      message.value = ''
    }, 5000)
  } finally {
    isUploading.value = false
  }
}

const deleteFile = async (category: string, fileName: string) => {
  try {
    const encodedFileName = encodeURIComponent(fileName)
    const response = await fetch(
      `/api/tierlist/${category}/${encodedFileName}`,
      {
        method: 'DELETE',
      },
    )
    if (!response.ok) throw new Error('Erreur lors de la suppression')
    await fetchTierLists()
    message.value = 'Fichier supprimé avec succès'
    messageType.value = 'success'
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    message.value =
      error instanceof Error ? error.message : 'Erreur lors de la suppression'
    messageType.value = 'error'
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
}

const toggleVisibility = async (category: string, fileName: string) => {
  const isPrivate = fileName.startsWith('private_')
  const newFileName = isPrivate
    ? fileName.replace('private_', '')
    : `private_${fileName}`

  try {
    const encodedFileName = encodeURIComponent(fileName)
    const response = await fetch(
      `/api/tierlist/${category}/${encodedFileName}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newFileName }),
      },
    )
    if (!response.ok) throw new Error('Erreur lors du changement de visibilité')
    await fetchTierLists()
    message.value = 'Visibilité modifiée avec succès'
    messageType.value = 'success'
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    message.value =
      error instanceof Error
        ? error.message
        : 'Erreur lors du changement de visibilité'
    messageType.value = 'error'
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
}
</script>

<template>
  <div class="list-type-tabs">
    <button
      v-for="tab in ['upload', 'gestion']"
      :key="tab"
      :class="{ active: activeTab === tab }"
      @click="activeTab = tab as 'upload' | 'gestion'"
    >
      {{ tab.toUpperCase() }}
    </button>
  </div>

  <div v-if="activeTab === 'upload'">
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

        <div class="filename-input">
          <label :for="filenameId">Nom du fichier:</label>
          <input
            :id="filenameId"
            v-model="fileName"
            type="text"
            placeholder="Entrez le nom du fichier"
            class="text-input"
          />
        </div>

        <div class="upload-actions">
          <button
            type="submit"
            :disabled="!selectedFile || !fileName.trim() || isUploading"
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

  <div v-else class="gestion-container">
    <div v-if="message" :class="['upload-message', messageType]">
      {{ message }}
    </div>

    <div v-if="isLoading" class="loading">Chargement des tier lists...</div>

    <div v-else>
      <div
        v-for="(files, category) in tierLists"
        :key="category"
        class="category-section"
      >
        <h3>
          {{
            category === 'normal'
              ? 'TIER-LISTE'
              : category === 'bronze'
                ? 'BRONZE-LISTE'
                : 'PRO-LISTE'
          }}
        </h3>
        <div class="files-list">
          <div v-for="file in files" :key="file" class="file-item">
            <div class="file-name">{{ file }}</div>
            <div class="file-actions">
              <button
                class="visibility-btn"
                @click="toggleVisibility(category, file)"
                :title="
                  file.startsWith('private_') ? 'Rendre public' : 'Rendre privé'
                "
              >
                {{ file.startsWith('private_') ? '👁️‍🗨️' : '👁️' }}
              </button>
              <button
                class="delete-btn"
                @click="deleteFile(category, file)"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
