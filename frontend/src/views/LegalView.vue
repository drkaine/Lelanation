<script setup lang="ts">
import { ref } from 'vue'
import LegalModal from '@/components/Modal/LegalModal.vue'
import { useConnexionStore } from '@/stores/connexionStore'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Mentions Légales et Politique de Confidentialité | Lelanation',
  description:
    'Mentions légales et politique de confidentialité de Lelanation. Respect du RGPD et protection des données personnelles.',
  keywords:
    'mentions légales, politique confidentialité, RGPD, protection données, conditions utilisation',
  type: 'website',
  structuredData: {
    '@type': 'WebPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Lelanation',
      description: 'Plateforme de builds et guides League of Legends',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Legal',
        url: 'https://www.lelanation.fr/legal',
      },
    },
  },
})

const connexionStore = useConnexionStore()
const showConfirmation = ref(false)
const email = import.meta.env.VITE_EMAIL_CONTACT

const clearAllData = () => {
  localStorage.clear()
  sessionStorage.clear()
  showConfirmation.value = true
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

const revokeAnalytics = () => {
  connexionStore.revokeConsent()
  showConfirmation.value = true
}
</script>

<template>
  <div class="legal-overlay">
    <main class="content">
      <h1 class="page-title">{{ $t('legal.title') }}</h1>

      <section class="privacy-policy-section">
        <h2>{{ $t('legal.privacy-policy') }}</h2>
        <LegalModal />
      </section>

      <section class="user-rights-section">
        <h2>{{ $t('legal.rights-section') }}</h2>

        <div class="action-buttons">
          <button @click="clearAllData" class="action-btn action-btn--danger">
            🗑️ {{ $t('legal.clear-all-data') }}
          </button>

          <button
            @click="revokeAnalytics"
            class="action-btn action-btn--warning"
          >
            📊 {{ $t('legal.revoke-consent') }}
          </button>

          <a
            :href="`mailto:${email}?subject=Demande RGPD`"
            class="action-btn action-btn--primary"
          >
            ✉️ {{ $t('legal.contact-rights') }}
          </a>
        </div>

        <div v-if="showConfirmation" class="confirmation">
          ✅ {{ $t('legal.action-success') }}
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.legal-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  overflow-y: auto;
}

.content {
  padding: 2rem;
  max-width: 800px;
  width: 100%;
}

.page-title {
  color: var(--color-gold-300);
  font-size: var(--title-base);
  margin: 0 0 2rem 0;
  text-align: center;
}

.content h2 {
  color: var(--color-gold-300);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: var(--title-sm);
}

.content h3 {
  color: var(--color-grey-50);
  margin: 1.5rem 0 0.5rem;
  font-size: var(--title-xs);
}

.privacy-policy-section {
  margin-bottom: 4rem;
}

.privacy-policy-section h2 {
  border-bottom: 2px solid var(--color-gold-300);
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.user-rights-section {
  padding: 2rem;
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-btn {
  padding: 0.8rem 1.2rem;
  border: 2px solid var(--color-gold-300);
  border-radius: 4px;
  font-size: var(--text-base);
  font-weight: 600;
  font-family: var(--font-beaufort);
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  display: block;
  background: transparent;
  color: var(--color-gold-300);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(200, 170, 110, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
  background: var(--color-gold-300);
  color: var(--color-blue-500);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn--primary {
  border-color: var(--color-gold-300);
  color: var(--color-gold-300);
}

.action-btn--primary:hover {
  background: var(--color-gold-300);
  color: var(--color-blue-500);
}

.action-btn--warning {
  border-color: var(--color-gold-400);
  color: var(--color-gold-400);
}

.action-btn--warning:hover {
  background: var(--color-gold-400);
  color: var(--color-blue-500);
}

.action-btn--danger {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.action-btn--danger:hover {
  background: #ff6b6b;
  color: var(--color-blue-500);
}

.confirmation {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    var(--color-gold-300),
    var(--color-gold-400)
  );
  color: var(--color-blue-500);
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  font-family: var(--font-beaufort);
  border: 1px solid var(--color-gold-300);
}

@media (min-width: 768px) {
  .action-buttons {
    flex-direction: row;
    gap: 1.5rem;
  }

  .action-btn {
    flex: 1;
    min-height: 3rem;
  }
}
</style>
