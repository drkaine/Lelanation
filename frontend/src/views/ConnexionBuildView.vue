<script setup lang="ts">
import { useConnexionStore } from '@/stores/connexionStore'
import { useRouter } from 'vue-router'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Connexion Développeur - Accès Build Tools',
  description:
    'Page de connexion pour les développeurs et créateurs de contenu Lelanation. Accès sécurisé aux outils de création de builds League of Legends.',
  keywords: 'connexion, développeur, build tools, accès sécurisé, Lelanation',
  type: 'website',
  noIndex: true, // Cette page ne doit pas être indexée pour des raisons de sécurité
})

const router = useRouter()
const connexionStore = useConnexionStore()

const nameTarget = [import.meta.env.VITE_NAME, import.meta.env.VITE_NAME_DEV]

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

if (nameTarget.includes(props.name)) {
  if (!connexionStore.isLoggedIn) {
    connexionStore.login(props.name)
    router.push('/build')
  } else {
    connexionStore.logout()
    router.push('/build')
  }
} else {
  router.push('/')
}
</script>

<template>
  <div class="connexion-container">
    <h1 class="visually-hidden">Redirection en cours...</h1>
    <div class="loading-spinner" aria-label="Chargement en cours"></div>
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.connexion-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c8941a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
