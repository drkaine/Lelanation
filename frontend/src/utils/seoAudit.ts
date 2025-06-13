import {
  generateLelanationSitemap,
  validateSitemapForNoIndex,
} from './sitemapGenerator'
import { SEOCanonicalValidator } from './seoValidation'

export interface SEOAuditReport {
  sitemap: {
    totalUrls: number
    indexableUrls: number
    noindexViolations: Array<{ url: string; issue: string }>
  }
  canonical: {
    compliant: number
    violations: number
    details: Array<{ url: string; issues: string[] }>
  }
  summary: {
    overallHealth: 'excellent' | 'good' | 'warning' | 'critical'
    score: number
    recommendations: string[]
  }
}

export class SEOAuditor {
  static auditSitemap(): SEOAuditReport['sitemap'] {
    const sitemap = generateLelanationSitemap()
    const noindexViolations = validateSitemapForNoIndex(sitemap)

    const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || []
    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''))

    return {
      totalUrls: urls.length,
      indexableUrls: urls.length - noindexViolations.length,
      noindexViolations,
    }
  }

  static auditCanonical(urls: string[]): SEOAuditReport['canonical'] {
    const compliance = SEOCanonicalValidator.validateSitemapCompliance(urls)

    return {
      compliant: compliance.summary.compliant,
      violations: compliance.summary.violations,
      details: compliance.violations,
    }
  }

  static generateFullReport(): SEOAuditReport {
    const sitemap = generateLelanationSitemap()
    const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || []
    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''))

    const sitemapAudit = this.auditSitemap()
    const canonicalAudit = this.auditCanonical(urls)

    const totalIssues =
      sitemapAudit.noindexViolations.length + canonicalAudit.violations
    const totalChecks = sitemapAudit.totalUrls + urls.length
    const score = Math.max(0, 100 - (totalIssues / totalChecks) * 100)

    let overallHealth: SEOAuditReport['summary']['overallHealth']
    if (score >= 95) overallHealth = 'excellent'
    else if (score >= 80) overallHealth = 'good'
    else if (score >= 60) overallHealth = 'warning'
    else overallHealth = 'critical'

    const recommendations: string[] = []

    if (sitemapAudit.noindexViolations.length > 0) {
      recommendations.push(
        `Remove ${sitemapAudit.noindexViolations.length} noindex page(s) from sitemap`,
      )
    }

    if (canonicalAudit.violations > 0) {
      recommendations.push(
        `Fix ${canonicalAudit.violations} canonical URL issue(s)`,
      )
    }

    if (recommendations.length === 0) {
      recommendations.push('All SEO checks passed! 🎉')
    }

    return {
      sitemap: sitemapAudit,
      canonical: canonicalAudit,
      summary: {
        overallHealth,
        score: Math.round(score),
        recommendations,
      },
    }
  }

  static logReport(): void {
    if (
      typeof import.meta === 'undefined' ||
      import.meta.env?.MODE !== 'development'
    )
      return

    const report = this.generateFullReport()

    console.group('🔍 SEO Audit Report')

    console.group(
      `📊 Overall Health: ${report.summary.overallHealth.toUpperCase()} (${report.summary.score}/100)`,
    )
    report.summary.recommendations.forEach(rec => {
      const icon = rec.includes('🎉') ? '✅' : '💡'
      console.log(`${icon} ${rec}`)
    })
    console.groupEnd()

    console.group('🗺️ Sitemap Analysis')
    console.log(`Total URLs: ${report.sitemap.totalUrls}`)
    console.log(`Indexable URLs: ${report.sitemap.indexableUrls}`)
    console.log(
      `Noindex Violations: ${report.sitemap.noindexViolations.length}`,
    )

    if (report.sitemap.noindexViolations.length > 0) {
      console.group('❌ Noindex Violations')
      report.sitemap.noindexViolations.forEach(violation => {
        console.warn(`🚫 ${violation.url}: ${violation.issue}`)
      })
      console.groupEnd()
    }
    console.groupEnd()

    console.group('🔗 Canonical Analysis')
    console.log(`Compliant URLs: ${report.canonical.compliant}`)
    console.log(`Violations: ${report.canonical.violations}`)

    if (report.canonical.details.length > 0) {
      console.group('❌ Canonical Violations')
      report.canonical.details.forEach(detail => {
        console.group(`🚫 ${detail.url}`)
        detail.issues.forEach(issue => console.warn(`  ⚠️ ${issue}`))
        console.groupEnd()
      })
      console.groupEnd()
    }
    console.groupEnd()

    console.groupEnd()
  }

  static validateProductionSitemap(
    sitemapUrl: string = 'https://www.lelanation.fr/sitemap.xml',
  ): Promise<{
    valid: boolean
    issues: string[]
  }> {
    return fetch(sitemapUrl)
      .then(response => response.text())
      .then(sitemapContent => {
        const issues = validateSitemapForNoIndex(sitemapContent)
        return {
          valid: issues.length === 0,
          issues: issues.map(issue => `${issue.url}: ${issue.issue}`),
        }
      })
      .catch(error => ({
        valid: false,
        issues: [`Failed to fetch sitemap: ${error.message}`],
      }))
  }
}

if (
  typeof import.meta !== 'undefined' &&
  import.meta.env?.MODE === 'development'
) {
  setTimeout(() => SEOAuditor.logReport(), 1000)
}
