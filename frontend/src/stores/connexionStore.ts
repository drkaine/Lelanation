import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_URL_API_SAVE

export const useConnexionStore = defineStore('Connexion', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const newUser = ref(localStorage.getItem('newUser') === 'true')

  const isUser = () => {
    if (!newUser.value) {
      incrementVisitCounter()
      newUser.value = true
      localStorage.setItem('newUser', 'true')
    }
  }

  const incrementVisitCounter = async () => {
    try {
      await fetch(`${API_URL}/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error)
    }
  }

  const login = () => {
    isLoggedIn.value = true
    localStorage.setItem('isLoggedIn', 'true')
  }

  const logout = () => {
    isLoggedIn.value = false
    localStorage.setItem('isLoggedIn', 'false')
  }

  return {
    isLoggedIn,
    newUser,
    isUser,
    login,
    logout,
  }
})
