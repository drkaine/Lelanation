<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/data/lastVersion.json'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'
import LegalModal from '@/components/Modal/LegalModal.vue'
import Footer from '@/components/FooterComponent.vue'

const buildStore = useBuildStore()
const connexionStore = useConnexionStore()
buildStore.loadUserBuilds()
const userBuilds = buildStore.userBuilds

const builds = ref([])

const urlApiSave = import.meta.env.VITE_URL_API_SAVE

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(async () => {
  try {
    const url = `${urlApiSave}/api/builds/lelariva`
    const response = await fetch(url)
    const data = await response.json()
    builds.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des builds:', error)
    builds.value = []
  }
})

const acceptConditions = () => {
  connexionStore.isUser()
}
</script>

<template>
  <div id="app" data-server-rendered="true" data-v-app="">
    <div class="app app-background">
      <div v-if="!connexionStore.newUser" class="modal-overlay">
        <div class="modal-content">
          <LegalModal />
          <div class="modal-actions">
            <button class="accept-btn" @click="acceptConditions">
              J'accepte les conditions
            </button>
          </div>
        </div>
      </div>
      <header role="banner">
        <nav class="header">
          <a href="/" class="link" aria-label="Accueil">
            <span>Accueil</span>
          </a>
          <button class="menu-mobile" @click="toggleMenu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 6l16 0"></path>
              <path d="M4 12l16 0"></path>
              <path d="M4 18l16 0"></path>
            </svg>
          </button>

          <div class="mobile-nav" :class="{ 'is-open': isMenuOpen }">
            <RouterLink
              title="statistique"
              class="version"
              to="/statistique"
              v-if="connexionStore.isLoggedIn"
              >Lelanalytics</RouterLink
            >
            <RouterLink to="/dictionnaire" @click="toggleMenu"
              >Leladictionnaiva</RouterLink
            >
            <RouterLink
              to="/build"
              @click="toggleMenu"
              class="link"
              aria-label="Créer un build"
            >
              Build
            </RouterLink>
            <RouterLink
              v-if="userBuilds.length > 0"
              to="/builds"
              @click="toggleMenu"
              >Mes builds</RouterLink
            >
            <RouterLink to="/builds-publics" @click="toggleMenu"
              >Builds de la communauté</RouterLink
            >
            <RouterLink
              v-if="builds.length > 0"
              to="/Lebuildarriva"
              @click="toggleMenu"
              >Lebuildarriva</RouterLink
            >
            <a
              href="https://www.leagueoflegends.com/fr-fr/news/tags/patch-notes"
              target="_blank"
              @click="toggleMenu"
              >{{ version }}</a
            >
          </div>
          <div class="right-header">
            <RouterLink
              title="statistique"
              class="version"
              to="/statistique"
              v-if="connexionStore.isLoggedIn"
              >Lelanalytics</RouterLink
            >
            <RouterLink title="dictionnaire" class="version" to="/dictionnaire">
              Leladictionnaiva</RouterLink
            >

            <RouterLink title="Build" class="version" to="/build">
              Build</RouterLink
            >
            <RouterLink to="/builds-publics"
              >Builds de la communauté</RouterLink
            >
            <RouterLink
              title="Mes builds"
              class="version"
              v-if="userBuilds.length > 0 && !connexionStore.isLoggedIn"
              to="/builds"
            >
              Mes builds</RouterLink
            >
            <RouterLink
              v-if="builds.length > 0"
              title="Lebuildarriva"
              class="version"
              to="/Lebuildarriva"
            >
              Lebuildarriva</RouterLink
            >

            <a
              href="https://www.leagueoflegends.com/fr-fr/news/tags/patch-notes"
              title="Patch Notes"
              target="_blank"
              class="link"
              >{{ version }}</a
            >
          </div>
        </nav>
      </header>

      <main role="main">
        <RouterView />
      </main>

      <footer role="contentinfo">
        <Footer />
      </footer>
    </div>
  </div>
</template>
