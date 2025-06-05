interface SEOIssue {
  type: 'error' | 'warning'
  message: string
  fix?: string
}

export class SEOAuditor {
  private issues: SEOIssue[] = []

  checkCanonicalRedirects(canonicalUrl: string): boolean {
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

  async validateSitemapUrls(sitemapUrl: string): Promise<SEOIssue[]> {
    try {
      const response = await fetch(sitemapUrl)
      const xmlText = await response.text()

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

  getOptimalCanonical(currentUrl: string): string {
    const url = new URL(currentUrl)

    if (url.hostname === 'lelanation.fr') {
      url.hostname = 'www.lelanation.fr'
    }

    url.protocol = 'https:'

    return url.toString()
  }

  getIssues(): SEOIssue[] {
    return this.issues
  }

  clearIssues(): void {
    this.issues = []
  }
}

export const seoAuditor = new SEOAuditor()
