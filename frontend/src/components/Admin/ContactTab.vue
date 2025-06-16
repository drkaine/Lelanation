<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ContactMessage } from '@/types/contact'

const contacts = ref<ContactMessage[]>([])
const loading = ref(true)
const error = ref('')

const fetchContacts = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/contact', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    if (!response.ok)
      throw new Error('Erreur lors de la récupération des contacts')
    contacts.value = await response.json()
  } catch {
    error.value = 'Impossible de charger les messages'
  } finally {
    loading.value = false
  }
}

const deleteMessage = async (category: string, date: string) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, date }),
    })

    if (!response.ok) throw new Error('Erreur lors de la suppression')

    await fetchContacts()
  } catch {
    error.value = 'Erreur lors de la suppression du message'
  }
}

onMounted(fetchContacts)
</script>

<template>
  <div class="contact-container">
    <div v-if="loading" class="loading">Chargement des messages...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="categories">
      <div
        v-for="category in contacts"
        :key="category.category"
        class="category-section"
      >
        <h3>Messages {{ category.category.toUpperCase() }}</h3>

        <div class="messages">
          <div
            v-for="(message, index) in category.messages"
            :key="index"
            class="message-card"
          >
            <div class="message-header">
              <span class="name">{{ message.name }}</span>
              <div class="header-right">
                <span class="date">{{
                  new Date(message.date).toLocaleDateString()
                }}</span>
                <button
                  @click="deleteMessage(category.category, message.date)"
                  class="delete-btn"
                >
                  Supprimer
                </button>
              </div>
            </div>
            <div class="email">{{ message.email }}</div>
            <div class="message">{{ message.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
