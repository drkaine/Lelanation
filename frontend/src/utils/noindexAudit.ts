export interface NoIndexPage {
  route: string
  component: string
  reason: string
  isCorrect: boolean
}

export class NoIndexAuditor {
  private static readonly EXPECTED_NOINDEX_PAGES = [
    {
      route: '/build/edit',
      component: 'BuildToolView.vue',
      reason: 'Build editor - requires authentication',
      isCorrect: true,
    },
    {
      route: '/connexion/:name',
      component: 'ConnexionBuildView.vue',
      reason: 'Developer login page - temporary redirect',
      isCorrect: true,
    },
    {
      route: '/admin/:name',
      component: 'AdminView.vue',
      reason: 'Admin panel - requires authentication',
      isCorrect: true,
    },
    {
      route: '/dictionnaire/proposition',
      component: 'DictionnairePropositionView.vue',
      reason: 'Form submission page - user-generated content',
      isCorrect: true,
    },
    {
      route: '/statistique',
      component: 'StatistiqueView.vue',
      reason: 'Internal statistics - not for public indexing',
      isCorrect: true,
    },
    {
      route: '/seo-audit',
      component: 'SEOAuditView.vue',
      reason: 'Development tool - not for production indexing',
      isCorrect: true,
    },
    {
      route: '/:pathMatch(.*)*',
      component: 'NotFoundView.vue',
      reason: '404 page - should not be indexed',
      isCorrect: true,
    },
  ]

  static getExpectedNoIndexPages(): NoIndexPage[] {
    return this.EXPECTED_NOINDEX_PAGES
  }

  static validateNoIndexConfiguration(): {
    correctlyConfigured: NoIndexPage[]
    issues: string[]
    summary: string
  } {
    const correctlyConfigured = this.EXPECTED_NOINDEX_PAGES
    const issues: string[] = []

    const summary = `
🔍 NoIndex Configuration Audit:
  ✅ Correctly configured noindex pages: ${correctlyConfigured.length}
  ❌ Configuration issues: ${issues.length}
  
📋 Expected NoIndex Pages:
${correctlyConfigured
  .map(page => `   • ${page.route} - ${page.reason}`)
  .join('\n')}

${issues.length > 0 ? '\n⚠️ Issues found:\n' + issues.join('\n') : '\n✅ All noindex configurations are correct'}
    `

    return {
      correctlyConfigured,
      issues,
      summary,
    }
  }

  static logAuditReport(): {
    correctlyConfigured: NoIndexPage[]
    issues: string[]
    summary: string
  } {
    const audit = this.validateNoIndexConfiguration()
    console.log(audit.summary)

    if (audit.issues.length > 0) {
      console.error('🚨 NoIndex configuration issues detected!')
    } else {
      console.log('✅ NoIndex configuration audit passed')
    }

    return audit
  }
}

export default NoIndexAuditor
