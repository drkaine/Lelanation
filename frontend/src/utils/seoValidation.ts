import type { RouteLocationNormalized } from 'vue-router'
import { isNoIndexRoute } from './sitemapGenerator'

export interface SEOValidationResult {
  isCanonical: boolean
  canonicalUrl: string
  issues: string[]
  redirectNeeded: boolean
  redirectUrl?: string
  shouldBeIndexed: boolean
  sitemapCompliant: boolean
}

export interface HeadingHierarchyIssue {
  level: number
  text: string
  expectedLevel?: number
  reason: string
}

export interface HeadingValidationResult {
  isValid: boolean
  issues: HeadingHierarchyIssue[]
  structure: Array<{ level: number; text: string }>
}

export class SEOCanonicalValidator {
  private static readonly CANONICAL_DOMAIN = 'https://www.lelanation.fr'

  private static readonly CANONICAL_ROUTES = [
    '/',
    '/build',
    '/builds',
    '/builds-publics',
    '/lelariva-builds',
    '/videos',
    '/dictionnaire',
    '/legal',
  ]

  private static readonly PUBLIC_ROUTES = [
    '/',
    '/build',
    '/builds-publics',
    '/lelariva-builds',
    '/videos',
    '/dictionnaire',
    '/legal',
  ]

  private static readonly INDEXABLE_ROUTES = [
    '/',
    '/build',
    '/builds-publics',
    '/lelariva-builds',
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
      shouldBeIndexed: true,
      sitemapCompliant: true,
    }

    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname

      result.shouldBeIndexed = !isNoIndexRoute(path)

      if (isNoIndexRoute(path)) {
        result.sitemapCompliant = false
        result.issues.push(
          `Route marquée noindex ne devrait pas être dans le sitemap: ${path}`,
        )
      }

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
        urlObj.pathname !== '/lelariva-builds'
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

      if (
        result.shouldBeIndexed &&
        !this.CANONICAL_ROUTES.includes(urlObj.pathname)
      ) {
        result.isCanonical = false
        result.issues.push(`Route non autorisée: ${urlObj.pathname}`)
      }

      if (result.redirectNeeded && !result.redirectUrl) {
        result.redirectUrl = this.buildCanonicalUrl(urlObj.pathname)
      }

      result.canonicalUrl = result.redirectUrl || url
    } catch (error) {
      result.isCanonical = false
      result.shouldBeIndexed = false
      result.sitemapCompliant = false
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

  static validateSitemapCompliance(sitemapUrls: string[]): {
    compliant: string[]
    violations: Array<{ url: string; issues: string[] }>
    summary: {
      total: number
      compliant: number
      violations: number
    }
  } {
    const compliant: string[] = []
    const violations: Array<{ url: string; issues: string[] }> = []

    sitemapUrls.forEach(url => {
      const validation = this.validateUrl(url)

      if (validation.sitemapCompliant && validation.shouldBeIndexed) {
        compliant.push(url)
      } else {
        const issues = []
        if (!validation.shouldBeIndexed) {
          issues.push('URL marked as noindex should not be in sitemap')
        }
        if (!validation.sitemapCompliant) {
          issues.push(
            ...validation.issues.filter(
              issue => issue.includes('noindex') || issue.includes('sitemap'),
            ),
          )
        }
        violations.push({ url, issues })
      }
    })

    return {
      compliant,
      violations,
      summary: {
        total: sitemapUrls.length,
        compliant: compliant.length,
        violations: violations.length,
      },
    }
  }

  static generateValidationReport(urls: string[]): void {
    if (
      typeof import.meta === 'undefined' ||
      import.meta.env?.MODE !== 'development'
    )
      return

    console.group('🔍 SEO Canonical Validation Report')

    const sitemapCompliance = this.validateSitemapCompliance(urls)

    console.group('📊 Sitemap Compliance Summary')
    console.log(`Total URLs: ${sitemapCompliance.summary.total}`)
    console.log(`✅ Compliant: ${sitemapCompliance.summary.compliant}`)
    console.log(`❌ Violations: ${sitemapCompliance.summary.violations}`)
    console.groupEnd()

    if (sitemapCompliance.violations.length > 0) {
      console.group('❌ Sitemap Violations')
      sitemapCompliance.violations.forEach(violation => {
        console.group(`🚫 ${violation.url}`)
        violation.issues.forEach(issue => console.warn(`  ⚠️  ${issue}`))
        console.groupEnd()
      })
      console.groupEnd()
    }

    urls.forEach(url => {
      const validation = this.validateUrl(url)

      if (validation.isCanonical && validation.sitemapCompliant) {
        console.log(`✅ ${url}`)
      } else {
        console.group(`❌ ${url}`)
        validation.issues.forEach(issue => console.warn(`  ⚠️  ${issue}`))
        if (validation.redirectUrl) {
          console.log(`  ➡️  Redirect to: ${validation.redirectUrl}`)
        }
        if (!validation.shouldBeIndexed) {
          console.warn(`  🚫  Should not be indexed`)
        }
        console.groupEnd()
      }
    })

    console.groupEnd()
  }

  static validateHeadingHierarchy(
    htmlContent: string,
  ): HeadingValidationResult {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
    const headings: Array<{ level: number; text: string }> = []
    const issues: HeadingHierarchyIssue[] = []

    let match
    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const level = parseInt(match[1])
      const text = match[2].replace(/<[^>]*>/g, '').trim()
      headings.push({ level, text })
    }

    if (headings.length === 0) {
      return { isValid: true, issues: [], structure: [] }
    }

    const h1Count = headings.filter(h => h.level === 1).length
    if (h1Count === 0) {
      issues.push({
        level: 1,
        text: '',
        reason: 'Missing h1 element on page',
      })
    } else if (h1Count > 1) {
      issues.push({
        level: 1,
        text: '',
        reason: `Multiple h1 elements found (${h1Count})`,
      })
    }

    let expectedLevel = 1
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]

      if (i === 0 && heading.level !== 1) {
        issues.push({
          level: heading.level,
          text: heading.text,
          expectedLevel: 1,
          reason: 'First heading should be h1',
        })
      }

      if (heading.level > expectedLevel + 1) {
        issues.push({
          level: heading.level,
          text: heading.text,
          expectedLevel: expectedLevel + 1,
          reason: `Skipped heading levels (jumped from h${expectedLevel} to h${heading.level})`,
        })
      }

      expectedLevel = Math.max(expectedLevel, heading.level)
    }

    return {
      isValid: issues.length === 0,
      issues,
      structure: headings,
    }
  }
}
