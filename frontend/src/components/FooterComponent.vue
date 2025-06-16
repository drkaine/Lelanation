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
      :class="{ 
        expanded: isFooterExpanded,
        'footer-open': isFooterExpanded 
      }"
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

    <footer
      class="footer"
      :class="{
        'footer-expanded': isFooterExpanded,
        'footer-collapsed': !isFooterExpanded,
      }"
    >
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

<style scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.footer-toggle {
  position: absolute;
  top: 38px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-blue-900);
  border: 1px solid var(--color-gold-300);
  border-radius: 15px 15px 0 0;
  padding: 6px 10px;
  cursor: pointer;
  color: var(--color-gold-300);
  transition: all 0.3s ease;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 999; 
}

.footer-toggle:hover {
  background: var(--color-blue-800);
  border-color: var(--color-gold-400);
  color: var(--color-gold-200);
}

.toggle-arrow {
  transition: transform 0.3s ease;
}

.footer-toggle.expanded .toggle-arrow {
  transform: rotate(180deg);
}

.footer-toggle.footer-open {
  top: -34px;
}

.footer {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-blue-900);
  border-top: 1px solid var(--color-gold-300);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  padding: 1rem 2rem;
  z-index: 1000; 
  position: relative;
}

.footer-collapsed {
  transform: translateY(100%);
}

.footer-expanded {
  transform: translateY(0);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.footer-link {
  color: var(--color-grey-100);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: var(--text-sm);
}

.footer-link:hover {
  color: var(--color-gold-300);
  background: rgba(218, 165, 32, 0.1);
}

.footer-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.connect p {
  color: var(--color-gold-300);
  font-weight: 600;
  margin: 0;
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer-toggle {
    top: -30px;
    padding: 5px 8px;
    border-radius: 12px 12px 0 0;
  }

  .footer-toggle.footer-open {
    top: -60px; 
  }

  .toggle-arrow {
    width: 14px;
    height: 14px;
  }

  .footer {
    padding: 1rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .left-section,
  .right-section {
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .footer-link {
    padding: 0.4rem 0.8rem;
    font-size: var(--text-xs);
  }
}
</style>
