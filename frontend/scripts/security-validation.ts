import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface SecurityCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  recommendation?: string
}

async function checkSecurityHeaders(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = []
  
  try {
    const { stdout } = await execAsync('curl -I https://www.lelanation.fr/ 2>/dev/null')
    const headers = stdout.toLowerCase()

    if (headers.includes('content-security-policy:')) {
      checks.push({
        name: 'Content Security Policy (CSP)',
        status: 'pass',
        message: 'CSP header is present and configured'
      })
    } else {
      checks.push({
        name: 'Content Security Policy (CSP)',
        status: 'fail',
        message: 'CSP header is missing',
        recommendation: 'Run ./.github/.scripts/csp-simple.sh to fix'
      })
    }

    if (headers.includes('strict-transport-security:')) {
      checks.push({
        name: 'HTTP Strict Transport Security (HSTS)',
        status: 'pass',
        message: 'HSTS header is present'
      })
    } else {
      checks.push({
        name: 'HTTP Strict Transport Security (HSTS)',
        status: 'fail',
        message: 'HSTS header is missing',
        recommendation: 'Add HSTS header to nginx configuration'
      })
    }

    if (headers.includes('x-frame-options:')) {
      checks.push({
        name: 'X-Frame-Options',
        status: 'pass',
        message: 'Clickjacking protection is enabled'
      })
    } else {
      checks.push({
        name: 'X-Frame-Options',
        status: 'fail',
        message: 'Clickjacking protection is missing'
      })
    }

    if (headers.includes('x-content-type-options:')) {
      checks.push({
        name: 'X-Content-Type-Options',
        status: 'pass',
        message: 'MIME sniffing protection is enabled'
      })
    } else {
      checks.push({
        name: 'X-Content-Type-Options',
        status: 'fail',
        message: 'MIME sniffing protection is missing'
      })
    }

    if (headers.includes('x-xss-protection:')) {
      checks.push({
        name: 'X-XSS-Protection',
        status: 'pass',
        message: 'XSS protection is enabled'
      })
    } else {
      checks.push({
        name: 'X-XSS-Protection',
        status: 'fail',
        message: 'XSS protection is missing'
      })
    }

    if (headers.includes('server: nginx/')) {
      checks.push({
        name: 'Server Version Disclosure',
        status: 'fail',
        message: 'Server version is disclosed in headers',
        recommendation: 'Add server_tokens off; to nginx configuration'
      })
    } else if (headers.includes('server: nginx')) {
      checks.push({
        name: 'Server Version Disclosure',
        status: 'pass',
        message: 'Server version is properly hidden'
      })
    }

  } catch (error) {
    checks.push({
      name: 'Security Headers Check',
      status: 'fail',
      message: `Failed to check headers: ${error instanceof Error ? error.message : String(error)}`
    })
  }

  return checks
}

async function validateCSPConfiguration(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = []

  try {
    const { stdout } = await execAsync('curl -I https://www.lelanation.fr/ 2>/dev/null | grep -i "content-security-policy"')
    
    if (stdout.includes('default-src')) {
      checks.push({
        name: 'CSP Default Source',
        status: 'pass',
        message: 'Default source directive is configured'
      })
    }

    if (stdout.includes('script-src')) {
      checks.push({
        name: 'CSP Script Source',
        status: 'pass',
        message: 'Script source directive is configured'
      })
    }

    if (stdout.includes('object-src \'none\'')) {
      checks.push({
        name: 'CSP Object Source',
        status: 'pass',
        message: 'Object sources are properly blocked'
      })
    }

    if (stdout.includes('frame-src \'none\'')) {
      checks.push({
        name: 'CSP Frame Source',
        status: 'pass',
        message: 'Frame sources are properly blocked'
      })
    }

    if (stdout.includes('unsafe-inline')) {
      checks.push({
        name: 'CSP Unsafe Inline',
        status: 'warning',
        message: 'CSP allows unsafe-inline scripts/styles',
        recommendation: 'Consider using nonces or hashes instead of unsafe-inline'
      })
    }

    if (stdout.includes('unsafe-eval')) {
      checks.push({
        name: 'CSP Unsafe Eval',
        status: 'warning',
        message: 'CSP allows unsafe-eval',
        recommendation: 'Consider build-time compilation to remove unsafe-eval'
      })
    }

  } catch {
    checks.push({
      name: 'CSP Configuration Check',
      status: 'fail',
      message: 'Failed to validate CSP configuration'
    })
  }

  return checks
}

async function runSecurityValidation() {
  console.log('🔒 Running Comprehensive Security Validation...\n')

  const headerChecks = await checkSecurityHeaders()
  const cspChecks = await validateCSPConfiguration()
  
  const allChecks = [...headerChecks, ...cspChecks]
  
  const passed = allChecks.filter(check => check.status === 'pass').length
  const failed = allChecks.filter(check => check.status === 'fail').length
  const warnings = allChecks.filter(check => check.status === 'warning').length

  console.log('='.repeat(60))
  console.log('🛡️  SECURITY VALIDATION REPORT')
  console.log('='.repeat(60))
  console.log(`📊 Summary: ${passed} passed, ${failed} failed, ${warnings} warnings\n`)

  const passedChecks = allChecks.filter(check => check.status === 'pass')
  const failedChecks = allChecks.filter(check => check.status === 'fail')
  const warningChecks = allChecks.filter(check => check.status === 'warning')

  if (passedChecks.length > 0) {
    console.log('✅ PASSED CHECKS:')
    passedChecks.forEach(check => {
      console.log(`   • ${check.name}: ${check.message}`)
    })
    console.log('')
  }

  if (warningChecks.length > 0) {
    console.log('⚠️  WARNINGS:')
    warningChecks.forEach(check => {
      console.log(`   • ${check.name}: ${check.message}`)
      if (check.recommendation) {
        console.log(`     💡 ${check.recommendation}`)
      }
    })
    console.log('')
  }

  if (failedChecks.length > 0) {
    console.log('❌ FAILED CHECKS:')
    failedChecks.forEach(check => {
      console.log(`   • ${check.name}: ${check.message}`)
      if (check.recommendation) {
        console.log(`     🔧 ${check.recommendation}`)
      }
    })
    console.log('')
  }

  const securityScore = Math.round((passed / allChecks.length) * 100)
  console.log(`🎯 Overall Security Score: ${securityScore}%`)

  if (securityScore >= 90) {
    console.log('🎉 Excellent security posture!')
  } else if (securityScore >= 80) {
    console.log('👍 Good security posture with room for improvement')
  } else if (securityScore >= 70) {
    console.log('⚠️  Security posture needs improvement')
  } else {
    console.log('🚨 Critical security issues need immediate attention')
  }

  console.log('')
  console.log('🔍 Test your security posture with external tools:')
  console.log('   • Mozilla Observatory: https://observatory.mozilla.org/')
  console.log('   • Security Headers: https://securityheaders.com/')
  console.log('   • CSP Evaluator: https://csp-evaluator.withgoogle.com/')

  if (failed > 0) {
    process.exit(1)
  }
}

runSecurityValidation().catch(error => {
  console.error('💥 Security validation failed:', error)
  process.exit(1)
}) 