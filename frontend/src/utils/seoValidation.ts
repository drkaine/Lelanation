import type { RouteLocationNormalized } from 'vue-router'

export interface SEOValidationResult {
  isCanonical: boolean
  canonicalUrl: string
  issues: string[]
  redirectNeeded: boolean
  redirectUrl?: string
}

export class SEOCanonicalValidator {
  private static readonly CANONICAL_DOMAIN = 'https://www.lelanation.fr'

  private static readonly CANONICAL_ROUTES = [
    '/',
    '/build',
    '/builds',
    '/builds-publics',
    '/Lebuildarriva',
    '/videos',
    '/dictionnaire',
    '/dictionnaire/proposition',
    '/statistique',
    '/legal',
  ]

  private static readonly PUBLIC_ROUTES = [
    '/',
    '/build',
    '/builds-publics',
    '/Lebuildarriva',
    '/videos',
    '/dictionnaire',
    '/legal',
  ]

  static validateUrl(url: string): SEOValidationResult {
    const result: SEOValidationResult = {
      isCanonical: true,
      canonicalUrl: url,
      issues: [],
      redirectNeeded: false,
    }

    try {
      const urlObj = new URL(url)

      if (!url.startsWith(this.CANONICAL_DOMAIN)) {
        result.isCanonical = false
        result.issues.push(`Domaine non canonique: ${urlObj.hostname}`)
        result.redirectNeeded = true
        result.redirectUrl = url.replace(urlObj.origin, this.CANONICAL_DOMAIN)
      }

      if (urlObj.protocol !== 'https:') {
        result.isCanonical = false
        result.issues.push(`Protocole non sécurisé: ${urlObj.protocol}`)
        result.redirectNeeded = true
      }

      if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
        result.isCanonical = false
        result.issues.push(`Slash final détecté: ${urlObj.pathname}`)
        result.redirectNeeded = true
        result.redirectUrl = url.replace(/\/$/, '')
      }

      if (
        urlObj.pathname !== urlObj.pathname.toLowerCase() &&
        urlObj.pathname !== '/Lebuildarriva'
      ) {
        result.isCanonical = false
        result.issues.push(
          `Majuscules détectées dans le path: ${urlObj.pathname}`,
        )
        result.redirectNeeded = true
        result.redirectUrl = url.replace(
          urlObj.pathname,
          urlObj.pathname.toLowerCase(),
        )
      }

      if (!this.CANONICAL_ROUTES.includes(urlObj.pathname)) {
        result.isCanonical = false
        result.issues.push(`Route non autorisée: ${urlObj.pathname}`)
      }

      if (result.redirectNeeded && !result.redirectUrl) {
        result.redirectUrl = this.buildCanonicalUrl(urlObj.pathname)
      }

      result.canonicalUrl = result.redirectUrl || url
    } catch (error) {
      result.isCanonical = false
      result.issues.push(
        `URL invalide: ${error instanceof Error ? error.message : String(error)}`,
      )
    }

    return result
  }

  static validateRoute(route: RouteLocationNormalized): SEOValidationResult {
    const fullUrl = `${this.CANONICAL_DOMAIN}${route.fullPath}`
    return this.validateUrl(fullUrl)
  }

  static buildCanonicalUrl(path: string): string {
    let cleanPath = path.toLowerCase()
    if (cleanPath !== '/' && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1)
    }

    return `${this.CANONICAL_DOMAIN}${cleanPath}`
  }

  static getRedirectUrl(currentUrl: string): string | null {
    const validation = this.validateUrl(currentUrl)
    return validation.redirectNeeded ? validation.redirectUrl || null : null
  }

  static validateSitemap(
    sitemapUrls: string[],
  ): Record<string, SEOValidationResult> {
    const results: Record<string, SEOValidationResult> = {}

    sitemapUrls.forEach(url => {
      results[url] = this.validateUrl(url)
    })

    return results
  }

  static generateValidationReport(urls: string[]): void {
    if (import.meta.env.MODE !== 'development') return

    console.group('🔍 SEO Canonical Validation Report')

    urls.forEach(url => {
      const validation = this.validateUrl(url)

      if (validation.isCanonical) {
        console.log(`✅ ${url}`)
      } else {
        console.group(`❌ ${url}`)
        validation.issues.forEach(issue => console.warn(`  ⚠️  ${issue}`))
        if (validation.redirectUrl) {
          console.log(`  ➡️  Redirect to: ${validation.redirectUrl}`)
        }
        console.groupEnd()
      }
    })

    console.groupEnd()
  }
}
