<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { normalizeUrl } from '@/composables/useCanonicalRedirect'

const route = useRoute()
const router = useRouter()
const baseUrl = 'https://www.lelanation.fr'

let canonicalLink: HTMLLinkElement | null = null

const redirectRules: Record<string, string> = {
  '/build/': '/build',
  '/builds-publics/': '/builds-publics',
  '/builds/': '/builds',
  '/home': '/',
  '/index': '/',
  '/index.html': '/',
  '/build/index': '/build',
  '/build/index.html': '/build',
  '/builds-publics/index': '/builds-publics',
  '/builds-publics/index.html': '/builds-publics',
}

const updateCanonical = (path: string) => {
  const normalizedPath = normalizeUrl(path)
  const cleanPath = normalizedPath.split('?')[0].split('#')[0]

  if (redirectRules[cleanPath] && redirectRules[cleanPath] !== cleanPath) {
    const targetPath = redirectRules[cleanPath]
    const query = route.query
    const hash = route.hash

    router.replace({
      path: targetPath,
      query: Object.keys(query).length > 0 ? query : undefined,
      hash: hash || undefined,
    })
    return
  }

  const canonicalUrl = `${baseUrl}${cleanPath}`

  if (canonicalLink) {
    canonicalLink.remove()
  }

  canonicalLink = document.createElement('link')
  canonicalLink.rel = 'canonical'
  canonicalLink.href = canonicalUrl
  document.head.appendChild(canonicalLink)

  addNoIndexForAlternatives(cleanPath)
}

const addNoIndexForAlternatives = (currentPath: string) => {
  const existingRobots = document.querySelector(
    'meta[name="robots"][data-canonical-manager]',
  )
  if (existingRobots) {
    existingRobots.remove()
  }

  const isAlternativeUrl = Object.keys(redirectRules).some(
    alt => alt !== currentPath && redirectRules[alt] === currentPath,
  )

  if (isAlternativeUrl) {
    const robotsMeta = document.createElement('meta')
    robotsMeta.name = 'robots'
    robotsMeta.content = 'noindex, nofollow'
    robotsMeta.setAttribute('data-canonical-manager', 'true')
    document.head.appendChild(robotsMeta)
  }
}

onMounted(() => {
  updateCanonical(route.path)
})

watch(
  () => route.path,
  newPath => {
    updateCanonical(newPath)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (canonicalLink) {
    canonicalLink.remove()
  }
  const robotsMeta = document.querySelector(
    'meta[name="robots"][data-canonical-manager]',
  )
  if (robotsMeta) {
    robotsMeta.remove()
  }
})
</script>

<template>
  <div class="hidden"></div>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
