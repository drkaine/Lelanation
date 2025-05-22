<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/data/lastVersion.json'
import { useBuildStore } from '@/stores/buildStore'
import { useConnexionStore } from '@/stores/connexionStore'
import LegalModal from '@/components/Modal/LegalModal.vue'
import Footer from '@/components/FooterComponent.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'
import { directTranslation } from './i18nCompat'
import { useAssetPreloading } from './composables/useAssetPreloading'

const buildStore = useBuildStore()
const connexionStore = useConnexionStore()
const { locale } = useI18n()

const translateDirect = (key: string) => {
  return directTranslation(key)
}

buildStore.loadUserBuilds()

const userBuilds = buildStore.userBuilds

const builds = ref([])

const urlApiSave = import.meta.env.VITE_URL_API_SAVE

const isMenuOpen = ref(false)
const acceptButtonRef = ref<HTMLButtonElement | null>(null)
const mobileNavRef = ref<HTMLDivElement | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    nextTick(() => {
      const firstLink = mobileNavRef.value?.querySelector(
        'a',
      ) as HTMLAnchorElement
      firstLink?.focus()
    })
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    toggleMenu()
    const menuButton = document.querySelector(
      '.menu-mobile',
    ) as HTMLButtonElement
    menuButton?.focus()
  }
}

onMounted(async () => {
  try {
    const url = `${urlApiSave}/api/builds/lelariva`
    const response = await fetch(url)
    const data = await response.json()
    builds.value = data

    document.addEventListener('keydown', handleEscapeKey)

    if (!connexionStore.newUser && acceptButtonRef.value) {
      nextTick(() => {
        acceptButtonRef.value?.focus()
      })
    }
  } catch (error) {
    console.error('Erreur lors du chargement des builds:', error)
    builds.value = []
  }
})

const acceptConditions = () => {
  connexionStore.isUser()
}

useAssetPreloading()
</script>

<template>
  <div id="app" data-server-rendered="true" data-v-app="">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <div class="app app-background">
      <div
        v-if="!connexionStore.newUser"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <div class="modal-content">
          <LegalModal />
          <div class="modal-actions">
            <button
              ref="acceptButtonRef"
              class="accept-btn"
              @click="acceptConditions"
            >
              {{ translateDirect('legal.accept') }}
            </button>
          </div>
        </div>
      </div>

      <header>
        <nav aria-label="Navigation principale">
          <div class="header">
            <div class="left-header">
              <LanguageSwitcher />
              <a href="/" class="link">
                <span>{{ $t('navigation.home') }}</span>
              </a>
            </div>

            <button
              class="menu-mobile"
              @click="toggleMenu"
              :aria-expanded="isMenuOpen"
              aria-controls="mobile-nav"
              aria-label="Menu de navigation"
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
                focusable="false"
              >
                <path d="M4 6l16 0"></path>
                <path d="M4 12l16 0"></path>
                <path d="M4 18l16 0"></path>
              </svg>
            </button>

            <div
              ref="mobileNavRef"
              id="mobile-nav"
              class="mobile-nav"
              :class="{ 'is-open': isMenuOpen }"
              :aria-hidden="!isMenuOpen"
            >
              <RouterLink
                title="statistique"
                class="version"
                to="/statistique"
                v-if="connexionStore.isLoggedIn"
                >{{ $t('navigation.analytics') }}</RouterLink
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
                to="/Lebuildarriva"
                title="lebuildarriva"
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
                >{{ $t('navigation.analytics') }}</RouterLink
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
                title="Lebuildarriva"
                class="version"
                to="/Lebuildarriva"
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
          </div>
        </nav>
      </header>

      <main id="main-content">
        <RouterView />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  </div>
</template>

<style>
/* Accessibility focus styles */
:focus {
  outline: 2px solid var(--color-gold-300);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Skip to content link - hidden until focused */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-blue-600);
  color: var(--color-gold-100);
  padding: 8px;
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

/* Ensure links are distinguishable */
a,
button,
[role='button'] {
  cursor: pointer;
}

/* Mobile menu aria-hidden behavior */
.mobile-nav[aria-hidden='true'] {
  display: none;
}
</style>
