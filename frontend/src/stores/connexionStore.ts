import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConnexionStore = defineStore('Connexion', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const newUser = ref(localStorage.getItem('newUser') === 'true')
  const userName = ref(localStorage.getItem('userName'))
  const analyticsConsent = ref(
    localStorage.getItem('analyticsConsent') === 'true',
  )

  const isUser = () => {
    if (!newUser.value) {
      newUser.value = true
      localStorage.setItem('newUser', 'true')

      if (!localStorage.getItem('analyticsConsent')) {
        analyticsConsent.value = true
        localStorage.setItem('analyticsConsent', 'true')
      }

      if (analyticsConsent.value) {
        incrementVisitCounter()
      }
    }
  }

  const incrementVisitCounter = async () => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error)
    }
  }

  const login = (userNameParam: string) => {
    isLoggedIn.value = true
    userName.value = userNameParam
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userName', userNameParam)
  }

  const logout = () => {
    isLoggedIn.value = false
    localStorage.setItem('isLoggedIn', 'false')
    localStorage.removeItem('userName')
  }

  const revokeConsent = () => {
    analyticsConsent.value = false
    localStorage.setItem('analyticsConsent', 'false')
  }

  return {
    isLoggedIn,
    newUser,
    analyticsConsent,
    isUser,
    userName,
    login,
    logout,
    revokeConsent,
  }
})
