import { generateLelanationSitemap, auditSitemapForNoIndexIssues, validateSitemapForNoIndex } from '../src/utils/sitemapGenerator'
import { NoIndexAuditor } from '../src/utils/noindexAudit'

async function runComprehensiveSEOCheck() {
  console.log('🚀 Starting Comprehensive SEO Check...\n')
  
  let allPassed = true
  const issues: string[] = []

  console.log('📋 Step 1: Sitemap Generation')
  try {
    const sitemap = generateLelanationSitemap(true)
    const urlCount = (sitemap.match(/<loc>/g) || []).length
    console.log(`✅ Sitemap generated successfully with ${urlCount} URLs`)
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error)
    allPassed = false
    issues.push('Sitemap generation failed')
  }

  console.log('\n📋 Step 2: NoIndex URL Validation')
  try {
    const sitemap = generateLelanationSitemap(true)
    const noIndexIssues = validateSitemapForNoIndex(sitemap)
    if (noIndexIssues.length === 0) {
      console.log('✅ No noindex URLs found in sitemap')
    } else {
      console.error('❌ Found noindex URLs in sitemap:', noIndexIssues)
      allPassed = false
      issues.push(`${noIndexIssues.length} noindex URLs in sitemap`)
    }
  } catch (error) {
    console.error('❌ NoIndex validation failed:', error)
    allPassed = false
    issues.push('NoIndex validation failed')
  }

  console.log('\n📋 Step 3: Comprehensive Sitemap Audit')
  try {
    const sitemap = generateLelanationSitemap(true)
    const audit = auditSitemapForNoIndexIssues(sitemap)
    if (audit.noIndexUrls.length === 0) {
      console.log(`✅ Sitemap audit passed - ${audit.validUrls.length} valid URLs`)
    } else {
      console.error(`❌ Sitemap audit failed - ${audit.noIndexUrls.length} problematic URLs`)
      allPassed = false
      issues.push('Sitemap contains noindex URLs')
    }
  } catch (error) {
    console.error('❌ Sitemap audit failed:', error)
    allPassed = false
    issues.push('Sitemap audit failed')
  }

  console.log('\n📋 Step 4: NoIndex Configuration Audit')
  try {
    const noindexAudit = NoIndexAuditor.validateNoIndexConfiguration()
    if (noindexAudit.issues.length === 0) {
      console.log(`✅ NoIndex configuration correct - ${noindexAudit.correctlyConfigured.length} pages properly configured`)
    } else {
      console.error('❌ NoIndex configuration issues found')
      allPassed = false
      issues.push('NoIndex configuration issues')
    }
  } catch (error) {
    console.error('❌ NoIndex configuration audit failed:', error)
    allPassed = false
    issues.push('NoIndex configuration audit failed')
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎯 FINAL SEO CHECK REPORT')
  console.log('='.repeat(60))
  
  if (allPassed) {
    console.log('🎉 ALL SEO CHECKS PASSED!')
    console.log('\n✅ Summary:')
    console.log('   • Sitemap generation: OK')
    console.log('   • NoIndex URL validation: OK')
    console.log('   • Sitemap audit: OK')
    console.log('   • NoIndex configuration: OK')
    console.log('\n🚀 Your website is ready for production!')
    
    const finalSitemap = generateLelanationSitemap(false)
    console.log('\n📤 Final sitemap ready for deployment' + finalSitemap)
    console.log('   Location: /public/sitemap.xml')
    
  } else {
    console.log('❌ SEO CHECK FAILED!')
    console.log('\n🚨 Issues found:')
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`)
    })
    console.log('\n🛠️  Please fix these issues before deployment.')
    process.exit(1)
  }
}

runComprehensiveSEOCheck().catch(error => {
  console.error('💥 Critical error during SEO check:', error)
  process.exit(1)
}) 