<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/data/lastVersion.json'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'

const buildStore = useBuildStore()
buildStore.loadUserBuilds()
const userBuilds = buildStore.userBuilds
const connexionStore = useConnexionStore()
const builds = ref([])

const urlApiSave = import.meta.env.VITE_URL_API_SAVE

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
</script>

<template>
  <div id="app" data-server-rendered="true" data-v-app="">
    <div data-v-f21e856a="" class="app app-background" style="">
      <div data-v-7cc930f8="" data-v-f21e856a="" class="header">
        <a data-v-7cc930f8="" href="/" class="name">Acceuil</a>
        <div data-v-7cc930f8="" class="overlay"></div>
        <button data-v-7cc930f8="" class="menu">
          <svg
            data-v-7cc930f8=""
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
        <div v-if="connexionStore.isLoggedIn">
          <p>Mode Lelariva</p>
        </div>
        <div data-v-7cc930f8="" class="right">
          <RouterLink
            title="dictionnaire"
            class="version"
            data-v-7cc930f8=""
            to="/dictionnaire"
          >
            Leladictionnaiva</RouterLink
          >
          <span data-v-7cc930f8="">•</span>
          <RouterLink
            title="Building"
            class="version"
            data-v-7cc930f8=""
            to="/build"
          >
            Building</RouterLink
          >
          <span data-v-7cc930f8="">•</span>
          <RouterLink
            title="Mes builds"
            class="version"
            data-v-7cc930f8=""
            v-if="userBuilds.length > 0"
            to="/builds"
          >
            Mes builds</RouterLink
          >
          <span data-v-7cc930f8="" v-if="userBuilds.length > 0">•</span>
          <RouterLink
            v-if="builds.length > 0"
            title="Lebuildarriva"
            class="version"
            data-v-7cc930f8=""
            to="/Lebuildarriva"
          >
            Lebuildarriva</RouterLink
          >
          <span data-v-7cc930f8="" v-if="builds.length > 0">•</span>
          <a
            data-v-7cc930f8=""
            href="https://www.leagueoflegends.com/fr-fr/news/tags/patch-notes"
            title="Patch Notes"
            target="_blank"
            class="version"
            >{{ version }}</a
          >
          <span data-v-7cc930f8="">•</span>
          <a
            data-v-7cc930f8=""
            href="https://github.com/drkaine"
            target="_blank"
            title="drkaine"
          >
            @darkaine</a
          >
        </div>
      </div>
      <RouterView />
    </div>
  </div>
</template>
