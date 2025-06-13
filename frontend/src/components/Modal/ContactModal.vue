<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const instanceId = Math.random().toString(36).substr(2, 9)
const subjectId = computed(() => `subject-${instanceId}`)
const nameId = computed(() => `name-${instanceId}`)
const emailId = computed(() => `email-${instanceId}`)
const messageId = computed(() => `message-${instanceId}`)
import object from '@/assets/files/data-manuel/object.json'

const { t } = useI18n()
const emit = defineEmits(['close'])
const error = ref('')
const success = ref(false)
const loading = ref(false)

const formData = ref({
  subject: '',
  name: '',
  email: '',
  message: '',
  consent: false,
})

const objectEntries = Object.entries(object).map(([id, name]) => ({ id, name }))

const submitForm = async () => {
  try {
    loading.value = true
    error.value = ''

    if (!formData.value.consent) {
      error.value = t('contact.consent-required')
      return
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: formData.value.subject,
        name: formData.value.name,
        email: formData.value.email,
        message: formData.value.message,
      }),
    })

    if (!response.ok) throw new Error("Erreur lors de l'envoi")

    success.value = true
    setTimeout(() => {
      emit('close')
    }, 2000)
  } catch {
    error.value = t('contact.send-error')
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
          <label :for="subjectId">{{ $t('contact.subject') }}</label>
          <select v-model="formData.subject" :id="subjectId" required>
            <option value="" disabled>{{ $t('contact.select') }}</option>
            <option v-for="obj in objectEntries" :key="obj.id" :value="obj.id">
              {{ obj.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label :for="nameId">{{ $t('contact.name') }}</label>
          <input type="text" :id="nameId" v-model="formData.name" />
        </div>

        <div class="form-group">
          <label :for="emailId">{{ $t('contact.email') }}</label>
          <input type="email" :id="emailId" v-model="formData.email" />
        </div>

        <div class="form-group">
          <label :for="messageId">{{ $t('contact.message') }}</label>
          <textarea
            :id="messageId"
            v-model="formData.message"
            required
            rows="5"
          ></textarea>
        </div>

        <div class="form-group consent-group">
          <label class="consent-label">
            <input
              type="checkbox"
              v-model="formData.consent"
              required
              class="consent-checkbox"
            />
            <span class="consent-text">
              {{ $t('contact.consent-text') }}
              <RouterLink to="/legal" target="_blank" class="legal-link">
                {{ $t('contact.privacy-policy') }}
              </RouterLink>
            </span>
          </label>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--gradient-primary);
  border: var(--border-size) solid var(--color-gold-400);
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  color: var(--color-gold-300);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: var(--title-sm);
  font-family: var(--font-beaufort);
}

.required {
  color: var(--color-gold-200);
  font-size: var(--text-xs);
  margin-bottom: 1rem;
  font-family: var(--font-spiegel);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-gold-200);
  font-weight: 500;
  font-family: var(--font-spiegel);
}

select,
input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-grey-400);
  background: var(--color-grey-500);
  color: var(--color-gold-100);
  border-radius: 4px;
  font-family: var(--font-spiegel);
  transition: border-color 0.2s ease;
}

select:focus,
input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-gold-300);
  box-shadow: 0 0 0 1px var(--color-gold-300);
}

select {
  cursor: pointer;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.consent-group {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--color-gold-300);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
}

.consent-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: var(--text-sm);
  line-height: 1.4;
  font-family: var(--font-spiegel);
}

.consent-checkbox {
  margin-top: 0.2rem;
  transform: scale(1.2);
  accent-color: var(--color-gold-300);
  cursor: pointer;
}

.consent-text {
  color: var(--color-grey-50);
}

.legal-link {
  color: var(--color-gold-300);
  text-decoration: underline;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: var(--color-gold-100);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-beaufort);
  transition: all 0.2s ease;
  border: 1px solid;
}

.submit-btn {
  background: var(--color-gold-300);
  color: var(--color-grey-500);
  border-color: var(--color-gold-300);
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-gold-400);
  border-color: var(--color-gold-400);
  transform: translateY(-1px);
}

.cancel-btn {
  background: transparent;
  color: var(--color-gold-200);
  border-color: var(--color-gold-200);
}

.cancel-btn:hover:not(:disabled) {
  background: var(--color-gold-200);
  color: var(--color-grey-500);
  border-color: var(--color-gold-200);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-family: var(--font-spiegel);
}

.success {
  color: var(--color-gold-300);
  background: rgba(200, 155, 60, 0.1);
  border: 1px solid var(--color-gold-300);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-family: var(--font-spiegel);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
