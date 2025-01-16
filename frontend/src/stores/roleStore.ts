import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoleStore = defineStore('role', () => {
  const selectedRoles = ref<Set<string>>(new Set())

  const updateSelectedRoles = (roles: Set<string>) => {
    selectedRoles.value = roles
  }

  const resetRoles = () => {
    selectedRoles.value = new Set()
  }

  return {
    selectedRoles,
    updateSelectedRoles,
    resetRoles,
  }
})
