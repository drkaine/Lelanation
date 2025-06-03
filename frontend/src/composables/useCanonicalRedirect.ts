import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SEOCanonicalValidator } from '@/utils/seoValidation'

export function useCanonicalRedirect() {
  const route = useRoute()
  const router = useRouter()
  const isRedirecting = ref(false)

  const checkAndRedirect = () => {
    if (typeof window === 'undefined') return

    const currentUrl = window.location.href
    const validation = SEOCanonicalValidator.validateUrl(currentUrl)

    if (validation.redirectNeeded && validation.redirectUrl) {
      isRedirecting.value = true

      if (import.meta.env.MODE === 'development') {
        console.group('🔄 Redirection canonique détectée')
        console.log(`From: ${currentUrl}`)
        console.log(`To: ${validation.redirectUrl}`)
        console.log(`Issues: ${validation.issues.join(', ')}`)
        console.groupEnd()
      }

      const newUrl = new URL(validation.redirectUrl)
      const newPath = newUrl.pathname + newUrl.search + newUrl.hash

      if (newPath !== route.fullPath) {
        router.replace(newPath)
      } else {
        window.location.replace(validation.redirectUrl)
      }
    }
  }

  const validateCurrentUrl = () => {
    if (typeof window === 'undefined') return null
    return SEOCanonicalValidator.validateUrl(window.location.href)
  }

  const getCanonicalUrl = () => {
    return SEOCanonicalValidator.buildCanonicalUrl(route.fullPath)
  }

  watchEffect(() => {
    checkAndRedirect()
  })

  return {
    isRedirecting,
    checkAndRedirect,
    validateCurrentUrl,
    getCanonicalUrl,
  }
}

export function normalizeUrl(url: string): string {
  url = url.replace(/\/+/g, '/')

  if (url.length > 1 && url.endsWith('/')) {
    url = url.slice(0, -1)
  }

  if (!url.startsWith('/')) {
    url = '/' + url
  }

  return url
}
