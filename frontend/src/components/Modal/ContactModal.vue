<script setup lang="ts">
import { ref } from 'vue'
import object from '@/assets/files/data-manuel/object.json'

const emit = defineEmits(['close'])
const error = ref('')
const success = ref(false)
const loading = ref(false)

const formData = ref({
  subject: '',
  name: '',
  message: '',
})

const objectEntries = Object.entries(object).map(([id, name]) => ({ id, name }))

const submitForm = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

    if (!response.ok) throw new Error("Erreur lors de l'envoi")

    success.value = true
    setTimeout(() => {
      emit('close')
    }, 2000)
  } catch {
    error.value = "Une erreur est survenue lors de l'envoi du message"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h2>{{ $t('contact.title') }}</h2>
      <form @submit.prevent="submitForm">
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ $t('contact.success') }}</p>
        <p class="required">* {{ $t('contact.required') }}</p>
        <div class="form-group">
          <label for="subject">{{ $t('contact.subject') }}</label>
          <select v-model="formData.subject" id="subject" required>
            <option value="" disabled>{{ $t('contact.select') }}</option>
            <option v-for="obj in objectEntries" :key="obj.id" :value="obj.id">
              {{ obj.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="name">{{ $t('contact.name') }}</label>
          <input type="text" id="name" v-model="formData.name" />
        </div>

        <div class="form-group">
          <label for="message">{{ $t('contact.message') }}</label>
          <textarea
            id="message"
            v-model="formData.message"
            required
            rows="5"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? $t('contact.sending') : $t('contact.send') }}
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="cancel-btn"
            :disabled="loading"
          >
            {{ $t('contact.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.required {
  color: var(--color-gold-200);
  font-size: 0.7rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--gradient-primary);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
}

h2 {
  color: var(--color-gold-300);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-gold-200);
}

select,
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-grey-400);
  background: var(--color-grey-500);
  color: var(--color-gold-100);
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background: var(--color-gold-300);
  color: var(--color-grey-500);
}

.cancel-btn {
  color: var(--color-gold-200);
}

.error {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.success {
  color: var(--color-success);
  margin-bottom: 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
