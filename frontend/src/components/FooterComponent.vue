<script setup lang="ts">
import { inject } from 'vue'
import { useConnexionStore } from '@/stores/connexionStore'

const connexionStore = useConnexionStore()

const contactModal = inject('contactModal') as {
  open: () => void
  close: () => void
}

const openContactModal = () => {
  if (contactModal) {
    contactModal.open()
  }
}
</script>

<template>
  <footer class="footer">
    <div class="connect" v-if="connexionStore.isLoggedIn">
      <p>{{ $t('footer.admin') }}</p>
    </div>
    <button
      @click="openContactModal"
      class="footer-link footer-button"
      type="button"
      aria-label="Ouvrir le formulaire de contact"
    >
      {{ $t('footer.contact') }}
    </button>
    <div class="right">
      <RouterLink to="/legal" class="footer-link">{{
        $t('footer.legal')
      }}</RouterLink>
      <a
        href="https://github.com/drkaine"
        target="_blank"
        rel="noopener noreferrer"
        title="drkaine"
        class="footer-link"
      >
        @darkaine
      </a>
    </div>
  </footer>
</template>
