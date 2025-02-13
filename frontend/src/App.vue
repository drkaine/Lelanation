<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/data/lastVersion.json'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'

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
          <h2>Bienvenue sur Lelanation</h2>

          <div class="legal-text">
            <h3>Cookies et Stockage Local</h3>
            <p>Nous utilisons le stockage local de votre navigateur pour :</p>
            <ul>
              <li>Sauvegarder vos builds personnalisés</li>
              <li>Mémoriser votre statut de connexion</li>
              <li>Garder en mémoire vos builds et éléments sélectionnéss</li>
            </ul>

            <h3>Durée de Conservation</h3>
            <p>Ces données sont conservées :</p>
            <ul>
              <li>Jusqu'à ce que vous supprimiez manuellement vos builds</li>
              <li>
                Jusqu'à ce que vous effaciez le stockage local de votre
                navigateur
              </li>
            </ul>

            <h3>Vos Droits</h3>
            <ul>
              <li>Supprimer vos builds via l'interface</li>
              <li>Réinitialiser vos préférences à tout moment</li>
              <li>
                Effacer toutes les données stockées en vidant le cache du
                navigateur
              </li>
            </ul>

            <h3>Propriété Intellectuelle</h3>
            <ul>
              <li>Les builds partagés sont sous licence Creative Commons</li>
              <li>League of Legends est une marque déposée de Riot Games</li>
              <li>
                Les données des champions et objets proviennent de l'API Riot
                Games
              </li>
              <li>Nous n'avons pas de lien avec Riot Games ni avec Lelariva</li>
            </ul>
          </div>

          <div class="modal-actions">
            <button class="accept-btn" @click="acceptConditions">
              J'accepte les conditions
            </button>
          </div>
        </div>
      </div>

      <header role="banner">
        <nav class="header">
          <a href="/" class="link">Acceuil</a>
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
            <RouterLink to="/dictionnaire" @click="toggleMenu"
              >Leladictionnaiva</RouterLink
            >
            <RouterLink to="/build" @click="toggleMenu">Build</RouterLink>
            <RouterLink
              v-if="userBuilds.length > 0"
              to="/builds"
              @click="toggleMenu"
              >Mes builds</RouterLink
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
