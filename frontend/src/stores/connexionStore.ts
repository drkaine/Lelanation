import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConnexionStore = defineStore('Connexion', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')

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
    login,
    logout,
  }
})
