<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ContactMessage {
  category: string
  messages: Array<{
    name: string
    email: string
    message: string
    date: string
  }>
}

const contacts = ref<ContactMessage[]>([])
const loading = ref(true)
const error = ref('')

const fetchContacts = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/contact')
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
        <h3>{{ category.category.toUpperCase() }}</h3>

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

<style scoped>
.contact-container {
  padding: 1rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-gold-200);
}

.error {
  color: var(--color-error);
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section h3 {
  color: var(--color-gold-300);
  margin-bottom: 1rem;
  font-family: var(--font-beaufort);
  border-bottom: 1px solid var(--color-gold-300);
  padding-bottom: 0.5rem;
}

.messages {
  display: grid;
  gap: 1rem;
}

.message-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  padding: 1.5rem;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.name {
  color: var(--color-gold-300);
  font-weight: bold;
}

.date {
  color: var(--color-gold-200);
  font-size: 0.9rem;
}

.email {
  color: var(--color-gold-200);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.message {
  color: var(--color-gold-100);
  white-space: pre-wrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.delete-btn {
  background: transparent;
  border: 1px solid var(--color-gold-300);
  color: var(--color-gold-300);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-beaufort);
  text-transform: uppercase;
  font-size: 0.8rem;
}

.delete-btn:hover {
  background: var(--color-gold-300);
  color: var(--color-grey-500);
}
</style>
