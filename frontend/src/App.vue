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
          <RouterLink title="dictionnaire" class="version" to="/dictionnaire">
            Leladictionnaiva</RouterLink
          >

          <RouterLink title="Build" class="version" to="/build">
            Build</RouterLink
          >

          <RouterLink
            title="Mes builds"
            class="version"
            v-if="userBuilds.length > 0"
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
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: black;
  border: 2px solid var(--gold-lol);
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  & h2 {
    color: var(--gold-lol);
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  & h3 {
    color: var(--sand-2);
    margin: 1.5rem 0 0.5rem;
    font-size: 1.2rem;
  }
}

.legal-text {
  color: var(--sand-2);
  font-size: 0.9rem;
  line-height: 1.6;

  & ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }

  & li {
    margin: 0.5rem 0;
  }
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.accept-btn {
  background: var(--gold-lol);
  color: var(--nox-grey4);
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(255, 185, 0, 0.2);
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .legal-text {
    font-size: 0.85rem;
  }
}
</style>
