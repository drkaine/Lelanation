import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import axios from 'axios'

export const useGameVersionStore = defineStore('gameVersion', () => {
  const currentVersion = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCurrentVersion = async () => {
    if (currentVersion.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await axios.get(
        'https://ddragon.leagueoflegends.com/api/versions.json',
      )
      currentVersion.value = response.data[0]
    } catch (err) {
      console.error('Error fetching game version:', err)
      error.value = 'Failed to load game version'
    } finally {
      isLoading.value = false
    }
  }

  const setVersion = (version: string) => {
    currentVersion.value = version
  }

  onMounted(() => {
    fetchCurrentVersion()
  })

  return {
    currentVersion,
    isLoading,
    error,
    fetchCurrentVersion,
    setVersion,
  }
})
