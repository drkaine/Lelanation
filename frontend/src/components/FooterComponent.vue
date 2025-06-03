<script setup lang="ts">
import { ref } from 'vue'
import { useConnexionStore } from '@/stores/connexionStore'
import ContactModal from '@/components/Modal/ContactModal.vue'

const connexionStore = useConnexionStore()
const showContactModal = ref(false)
</script>

<template>
  <footer class="footer">
    <div class="connect" v-if="connexionStore.isLoggedIn">
      <p>{{ $t('footer.admin') }}</p>
    </div>
    <button
      @click="showContactModal = true"
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

    <ContactModal v-if="showContactModal" @close="showContactModal = false" />
  </footer>
</template>
