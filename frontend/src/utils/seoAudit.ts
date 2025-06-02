/**
 * SEO Audit Utilities
 * Helps detect and prevent common SEO issues
 */

interface SEOIssue {
  type: 'error' | 'warning'
  message: string
  fix?: string
}

export class SEOAuditor {
  private issues: SEOIssue[] = []

  /**
   * Check for redirect canonical URLs
   */
  checkCanonicalRedirects(canonicalUrl: string): boolean {
    // Check if canonical URL would cause a redirect
    const currentDomain = window.location.hostname
    const canonicalDomain = new URL(canonicalUrl).hostname

    if (
      currentDomain === 'lelanation.fr' &&
      canonicalDomain === 'lelanation.fr'
    ) {
      this.issues.push({
        type: 'error',
        message: 'Canonical URL points to redirecting domain',
        fix: 'Use www.lelanation.fr as canonical',
      })
      return false
    }

    return true
  }

  /**
   * Validate sitemap URLs
   */
  async validateSitemapUrls(sitemapUrl: string): Promise<SEOIssue[]> {
    try {
      const response = await fetch(sitemapUrl)
      const xmlText = await response.text()

      // Parse XML and check for redirect URLs
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      const urls = xmlDoc.getElementsByTagName('loc')

      const issues: SEOIssue[] = []

      for (const urlElement of Array.from(urls)) {
        const url = urlElement.textContent
        if (url && url.includes('lelanation.fr/') && !url.includes('www.')) {
          issues.push({
            type: 'warning',
            message: `Sitemap contains redirecting URL: ${url}`,
            fix: 'Replace with www.lelanation.fr URL',
          })
        }
      }

      return issues
    } catch (error) {
      return [
        {
          type: 'error',
          message: 'Could not validate sitemap' + error,
          fix: 'Check sitemap accessibility',
        },
      ]
    }
  }

  /**
   * Check for excessive redirects
   */
  async checkRedirectChain(url: string): Promise<number> {
    let redirectCount = 0
    let currentUrl = url

    try {
      while (redirectCount < 5) {
        const response = await fetch(currentUrl, {
          method: 'HEAD',
          redirect: 'manual',
        })

        if (response.status >= 300 && response.status < 400) {
          redirectCount++
          const location = response.headers.get('Location')
          if (location) {
            currentUrl = new URL(location, currentUrl).toString()
          } else {
            break
          }
        } else {
          break
        }
      }
    } catch (error) {
      console.warn('Could not check redirect chain:', error)
    }

    return redirectCount
  }

  /**
   * Get optimal canonical URL
   */
  getOptimalCanonical(currentUrl: string): string {
    const url = new URL(currentUrl)

    // Always prefer www.lelanation.fr
    if (url.hostname === 'lelanation.fr') {
      url.hostname = 'www.lelanation.fr'
    }

    // Ensure HTTPS
    url.protocol = 'https:'

    return url.toString()
  }

  /**
   * Get all detected issues
   */
  getIssues(): SEOIssue[] {
    return this.issues
  }

  /**
   * Clear issues
   */
  clearIssues(): void {
    this.issues = []
  }
}

export const seoAuditor = new SEOAuditor()
