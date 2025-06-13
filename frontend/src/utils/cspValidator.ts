export interface CSPDirective {
  directive: string
  sources: string[]
  description: string
  isSecure: boolean
}

export interface CSPViolation {
  directive: string
  violatedDirective: string
  blockedURI: string
  lineNumber?: number
  columnNumber?: number
  sourceFile?: string
}

export class CSPValidator {
  private static readonly RECOMMENDED_CSP: Record<string, CSPDirective> = {
    'default-src': {
      directive: 'default-src',
      sources: ["'self'"],
      description: 'Default policy for all resource types',
      isSecure: true,
    },
    'script-src': {
      directive: 'script-src',
      sources: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:', 'data:'],
      description: 'Sources for JavaScript execution',
      isSecure: false,
    },
    'style-src': {
      directive: 'style-src',
      sources: ["'self'", "'unsafe-inline'", 'data:'],
      description: 'Sources for stylesheets',
      isSecure: false,
    },
    'img-src': {
      directive: 'img-src',
      sources: [
        "'self'",
        'data:',
        'blob:',
        'https://www.lelanation.fr',
        'https://lelanation.fr',
        'https://i.ytimg.com',
        'https://yt3.ggpht.com',
      ],
      description: 'Sources for images',
      isSecure: true,
    },
    'font-src': {
      directive: 'font-src',
      sources: ["'self'", 'data:'],
      description: 'Sources for fonts',
      isSecure: true,
    },
    'connect-src': {
      directive: 'connect-src',
      sources: ["'self'", 'https://www.lelanation.fr', 'https://lelanation.fr'],
      description: 'Sources for fetch, XHR, WebSocket connections',
      isSecure: true,
    },
    'media-src': {
      directive: 'media-src',
      sources: ["'self'", 'data:', 'blob:'],
      description: 'Sources for audio and video',
      isSecure: true,
    },
    'object-src': {
      directive: 'object-src',
      sources: ["'none'"],
      description: 'Sources for plugins (object, embed, applet)',
      isSecure: true,
    },
    'frame-src': {
      directive: 'frame-src',
      sources: ["'none'"],
      description: 'Sources for nested frames',
      isSecure: true,
    },
    'frame-ancestors': {
      directive: 'frame-ancestors',
      sources: ["'self'"],
      description: 'Sources that can embed this page',
      isSecure: true,
    },
    'form-action': {
      directive: 'form-action',
      sources: ["'self'"],
      description: 'URLs for form submissions',
      isSecure: true,
    },
    'base-uri': {
      directive: 'base-uri',
      sources: ["'self'"],
      description: 'URLs for base element',
      isSecure: true,
    },
    'manifest-src': {
      directive: 'manifest-src',
      sources: ["'self'"],
      description: 'Sources for web app manifests',
      isSecure: true,
    },
    'worker-src': {
      directive: 'worker-src',
      sources: ["'self'", 'blob:'],
      description: 'Sources for web workers',
      isSecure: true,
    },
  }

  static generateCSPString(): string {
    const directives = Object.values(this.RECOMMENDED_CSP)
      .map(({ directive, sources }) => `${directive} ${sources.join(' ')}`)
      .join('; ')

    return directives
  }

  static validateCurrentCSP(): {
    hasCSP: boolean
    cspHeader?: string
    securityScore: number
    recommendations: string[]
    warnings: string[]
  } {
    const metaCSP = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]',
    )
    const hasCSP = !!metaCSP
    const cspHeader = metaCSP?.getAttribute('content') || undefined

    const recommendations: string[] = []
    const warnings: string[] = []
    let securityScore = 0

    if (!hasCSP) {
      warnings.push('❌ No Content Security Policy found')
      recommendations.push('🔧 Implement CSP headers at server level')
      return { hasCSP, securityScore: 0, recommendations, warnings }
    }

    const directives = Object.values(this.RECOMMENDED_CSP)
    let secureDirectives = 0

    directives.forEach(({ directive, isSecure, description }) => {
      if (cspHeader?.includes(directive)) {
        if (isSecure) {
          secureDirectives++
        } else {
          warnings.push(
            `⚠️ ${directive}: ${description} - Contains unsafe directives`,
          )
        }
      } else {
        recommendations.push(`🔧 Add ${directive}: ${description}`)
      }
    })

    securityScore = Math.round((secureDirectives / directives.length) * 100)

    if (cspHeader?.includes("'unsafe-inline'")) {
      warnings.push(
        "⚠️ 'unsafe-inline' allows inline scripts/styles - XSS risk",
      )
    }
    if (cspHeader?.includes("'unsafe-eval'")) {
      warnings.push("⚠️ 'unsafe-eval' allows eval() - code injection risk")
    }

    return {
      hasCSP,
      cspHeader,
      securityScore,
      recommendations,
      warnings,
    }
  }

  static monitorCSPViolations(): void {
    document.addEventListener('securitypolicyviolation', e => {
      const violation: CSPViolation = {
        directive: e.effectiveDirective,
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        lineNumber: e.lineNumber,
        columnNumber: e.columnNumber,
        sourceFile: e.sourceFile,
      }

      console.warn('🚨 CSP Violation:', violation)

      if (import.meta.env.PROD) {
        this.reportViolation(violation)
      }
    })
  }

  private static reportViolation(violation: CSPViolation): void {
    fetch('/csp-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'csp-report': violation,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(error => {
      console.error('Failed to report CSP violation:', error)
    })
  }

  static logSecurityReport(): {
    hasCSP: boolean
    cspHeader?: string
    securityScore: number
    recommendations: string[]
    warnings: string[]
  } {
    const validation = this.validateCurrentCSP()

    console.group('🛡️ Content Security Policy Report')
    console.log(`Security Score: ${validation.securityScore}/100`)

    if (validation.hasCSP) {
      console.log('✅ CSP is configured')
      console.log('Current CSP:', validation.cspHeader)
    } else {
      console.log('❌ No CSP configured')
    }

    if (validation.warnings.length > 0) {
      console.group('⚠️ Security Warnings')
      validation.warnings.forEach(warning => console.log(warning))
      console.groupEnd()
    }

    if (validation.recommendations.length > 0) {
      console.group('🔧 Recommendations')
      validation.recommendations.forEach(rec => console.log(rec))
      console.groupEnd()
    }

    console.groupEnd()

    return validation
  }

  static getRecommendedCSPForNginx(): string {
    return `
# Content Security Policy Configuration for nginx
add_header Content-Security-Policy "${this.generateCSPString()}" always;

# Alternative CSP for older browsers  
add_header X-Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'none';" always;
    `.trim()
  }
}

export default CSPValidator
