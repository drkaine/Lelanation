<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/data/lastVersion.json'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'
import LegalModal from '@/components/Modal/LegalModal.vue'
import ContactModal from '@/components/Modal/ContactModal.vue'
import Footer from '@/components/FooterComponent.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'
import { directTranslation } from './i18nCompat'
import { useAssetPreloading } from './composables/useAssetPreloading'
import CanonicalManager from './components/SEO/CanonicalManager.vue'

const buildStore = useBuildStore()
const connexionStore = useConnexionStore()
const { locale } = useI18n()

const adminName =
  import.meta.env.VITE_NAME === connexionStore.userName
    ? import.meta.env.VITE_ADMIN
    : import.meta.env.VITE_NAME_DEV === connexionStore.userName
      ? import.meta.env.VITE_ADMIN_RIGHT
      : ''

const translateDirect = (key: string) => {
  return directTranslation(key)
}

buildStore.loadUserBuilds()

const userBuilds = buildStore.userBuilds

const builds = ref([])

const urlApiSave = import.meta.env.VITE_URL_API_SAVE

const isMenuOpen = ref(false)
const showContactModal = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const openContactModal = () => {
  showContactModal.value = true
}

const closeContactModal = () => {
  showContactModal.value = false
}

provide('contactModal', {
  open: openContactModal,
  close: closeContactModal,
})

onMounted(async () => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(async () => {
      try {
        const url = `${urlApiSave}/api/builds/lelariva`
        const response = await fetch(url, { priority: 'low' })
        if (response.ok) {
          const data = await response.json()
          builds.value = data
        }
      } catch (error) {
        console.error('Error loading builds:', error)
        builds.value = []
      }
    })
  } else {
    setTimeout(async () => {
      try {
        const url = `${urlApiSave}/api/builds/lelariva`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          builds.value = data
        }
      } catch (error) {
        console.error('Error loading builds:', error)
        builds.value = []
      }
    }, 2000)
  }
})

const acceptConditions = () => {
  connexionStore.isUser()
}

useAssetPreloading({
  preloadImages: true,
  preloadJsonData: true,
  preloadDirectories: false,
  enableApiPreloading: false,
})
</script>

<template>
  <div id="app" data-server-rendered="true" data-v-app="">
    <CanonicalManager />

    <div class="app app-background">
      <div v-if="!connexionStore.newUser" class="modal-overlay">
        <div class="modal-content">
          <LegalModal />
          <div class="modal-actions">
            <button class="accept-btn" @click="acceptConditions">
              {{ translateDirect('legal.accept') }}
            </button>
          </div>
        </div>
      </div>
      <header role="banner">
        <nav class="header">
          <div class="left-header">
            <LanguageSwitcher />
            <a href="/" class="link" aria-label="Accueil">
              <span>{{ $t('navigation.home') }}</span>
            </a>
            <div>
              <RouterLink
                title="admin"
                class="version"
                :to="`/admin/${adminName}`"
                v-if="connexionStore.isLoggedIn && adminName !== ''"
                >{{ $t('navigation.admin') }}</RouterLink
              >
            </div>
          </div>
          <button
            class="menu-mobile"
            @click="toggleMenu"
            :aria-expanded="isMenuOpen"
            :aria-label="$t('navigation.menu')"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
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
              @click="toggleMenu"
              v-if="connexionStore.isLoggedIn"
              >{{ $t('navigation.statistique') }}</RouterLink
            >

            <RouterLink
              to="/videos"
              title="videos"
              class="version"
              @click="toggleMenu"
            >
              {{ $t('navigation.videos') }}</RouterLink
            >
            <RouterLink
              v-if="locale === 'laranguiva'"
              to="/dictionnaire"
              title="dictionnaire"
              class="version"
              @click="toggleMenu"
              >{{ $t('navigation.dictionary') }}</RouterLink
            >
            <RouterLink
              to="/build"
              title="build"
              class="version"
              @click="toggleMenu"
              aria-label="Créer un build"
            >
              {{ $t('navigation.build') }}
            </RouterLink>
            <RouterLink
              v-if="userBuilds.length > 0"
              to="/builds"
              title="mes builds"
              class="version"
              @click="toggleMenu"
              >{{ $t('navigation.builds-private') }}</RouterLink
            >
            <RouterLink
              to="/builds-publics"
              title="builds publics"
              class="version"
              @click="toggleMenu"
              >{{ $t('navigation.builds-public') }}</RouterLink
            >
            <RouterLink
              v-if="builds.length > 0"
              to="/lelariva-builds"
              title="lelariva builds"
              class="version"
              @click="toggleMenu"
              >{{ $t('navigation.lela-builds') }}</RouterLink
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
              >{{ $t('navigation.statistique') }}</RouterLink
            >
            <RouterLink to="/videos" title="videos" class="version">
              {{ $t('navigation.videos') }}</RouterLink
            >
            <RouterLink
              v-if="locale === 'laranguiva'"
              title="dictionnaire"
              class="version"
              to="/dictionnaire"
              >{{ $t('navigation.dictionary') }}</RouterLink
            >

            <RouterLink title="Build" class="version" to="/build">
              {{ $t('navigation.build') }}</RouterLink
            >
            <RouterLink to="/builds-publics">{{
              $t('navigation.builds-public')
            }}</RouterLink>
            <RouterLink
              title="Mes builds"
              class="version"
              v-if="userBuilds.length > 0 && !connexionStore.isLoggedIn"
              to="/builds"
            >
              {{ $t('navigation.builds-private') }}</RouterLink
            >
            <RouterLink
              v-if="builds.length > 0"
              title="lelariva builds"
              class="version"
              to="/lelariva-builds"
            >
              {{ $t('navigation.lela-builds') }}</RouterLink
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

    <!-- Contact Modal at app level for proper z-index -->
    <ContactModal v-if="showContactModal" @close="closeContactModal" />
  </div>
</template>
