<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useConnexionStore } from '@/stores/connexionStore'
import ContactModal from '@/components/Modal/ContactModal.vue'

const connexionStore = useConnexionStore()
const showContactModal = ref(false)
const lastFocusedElement = ref<HTMLElement | null>(null)
const contactModalRef = ref<InstanceType<typeof ContactModal> | null>(null)

const openContactModal = () => {
  lastFocusedElement.value = document.activeElement as HTMLElement
  showContactModal.value = true
}

const closeContactModal = () => {
  showContactModal.value = false
  nextTick(() => {
    lastFocusedElement.value?.focus()
  })
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showContactModal.value) {
    closeContactModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

watch(showContactModal, newVal => {
  if (newVal) {
    nextTick(() => {
      const focusableElement = contactModalRef.value?.$el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as HTMLElement
      if (focusableElement) {
        focusableElement.focus()
      }
    })
  }
})
</script>

<template>
  <div class="footer-container">
    <div class="footer">
      <div class="connect" v-if="connexionStore.isLoggedIn">
        <p>{{ $t('footer.admin') }}</p>
      </div>
      <a
        href="#"
        @click.prevent="openContactModal"
        class="footer-link"
        aria-haspopup="dialog"
      >
        {{ $t('footer.contact') }}
      </a>
      <nav class="right" aria-label="Liens du pied de page">
        <RouterLink to="/legal" class="footer-link">
          {{ $t('footer.legal') }}
        </RouterLink>
        <a
          href="https://github.com/drkaine"
          target="_blank"
          title="drkaine"
          class="footer-link"
          rel="noopener noreferrer"
        >
          @darkaine
        </a>
      </nav>
    </div>

    <ContactModal
      v-if="showContactModal"
      @close="closeContactModal"
      ref="contactModalRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    />
  </div>
</template>

<style scoped>
.footer-container {
  width: 100%;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.footer-link {
  margin: 0 0.5rem;
  text-decoration: none;
  color: var(--color-gold-100);
  position: relative;
}

.footer-link:hover,
.footer-link:focus {
  color: var(--color-gold-300);
  text-decoration: underline;
}

.right {
  display: flex;
  gap: 1rem;
}
</style>
