<script setup lang="ts">
import { ref } from 'vue'
import LegalModal from '@/components/Modal/LegalModal.vue'
import { useConnexionStore } from '@/stores/connexionStore'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Mentions Légales et Politique de Confidentialité | Lelanation',
  description:
    "Mentions légales, politique de confidentialité et conditions d'utilisation de Lelanation. Respect du RGPD et protection de vos données personnelles.",
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
    <div class="content">
      <h1 class="page-title">{{ $t('legal.title') }}</h1>
      <LegalModal />

      <div class="actions-section">
        <h3>Exercer vos droits RGPD</h3>

        <div class="action-buttons">
          <button @click="clearAllData" class="action-btn danger">
            🗑️ Effacer toutes mes données locales
          </button>

          <button @click="revokeAnalytics" class="action-btn warning">
            📊 Retirer mon consentement aux statistiques
          </button>

          <a
            :href="`mailto:${email}?subject=Demande RGPD`"
            class="action-btn primary"
          >
            ✉️ Contacter pour exercer mes droits
          </a>
        </div>

        <div v-if="showConfirmation" class="confirmation">
          ✅ Action effectuée avec succès !
        </div>
      </div>
    </div>
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

.actions-section {
  margin-top: 3rem;
  padding: 2rem;
  border: 1px solid var(--color-gold-300);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  display: block;
}

.action-btn.primary {
  background: var(--color-gold-300);
  color: var(--color-grey-900);
}

.action-btn.warning {
  background: #f59e0b;
  color: white;
}

.action-btn.danger {
  background: #dc2626;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.confirmation {
  margin-top: 1rem;
  padding: 1rem;
  background: #10b981;
  color: white;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
}

@media (min-width: 768px) {
  .action-buttons {
    flex-direction: row;
    gap: 1rem;
  }

  .action-btn {
    flex: 1;
  }
}
</style>
