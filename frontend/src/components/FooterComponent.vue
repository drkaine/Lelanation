<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted } from 'vue'
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

const isFooterExpanded = ref(false)
const isScrollingDown = ref(false)
let lastScrollY = 0

const toggleFooter = () => {
  isFooterExpanded.value = !isFooterExpanded.value
}

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // Fermer automatiquement le footer quand on scroll vers le bas
  if (currentScrollY > lastScrollY + 50 && isFooterExpanded.value) {
    isScrollingDown.value = true
    isFooterExpanded.value = false
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="footer-container">
    <button
      @click="toggleFooter"
      class="footer-toggle"
      :data-expanded="isFooterExpanded"
      aria-label="Afficher/masquer le footer"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="toggle-arrow"
      >
        <polyline points="18,15 12,9 6,15"></polyline>
      </svg>
    </button>

    <footer class="footer" :data-expanded="isFooterExpanded">
      <div class="footer-content">
        <div class="left-section">
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
          <RouterLink to="/dictionnaire" class="footer-link">{{
            $t('navigation.dictionary')
          }}</RouterLink>
        </div>
        <div class="right-section">
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
      </div>
    </footer>
  </div>
</template>
