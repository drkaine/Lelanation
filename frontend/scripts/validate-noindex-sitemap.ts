import { generateLelanationSitemap, validateSitemapForNoIndex, isNoIndexRoute } from '../src/utils/sitemapGenerator.js'

interface NoIndexValidationResult {
  sitemap: {
    totalUrls: number
    validUrls: string[]
    invalidUrls: string[]
  }
  recommendations: string[]
  status: 'success' | 'warning' | 'error'
}

async function validateNoIndexConfiguration(): Promise<NoIndexValidationResult> {
  console.log('🔍 Validation de la configuration noindex...\n')
  
  const sitemap = generateLelanationSitemap(true)
   validateSitemapForNoIndex(sitemap)
  
  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || []
  const sitemapUrls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''))
  
  const validUrls: string[] = []
  const invalidUrls: string[] = []
  
  sitemapUrls.forEach(url => {
    const path = url.replace('https://www.lelanation.fr', '')
    if (isNoIndexRoute(path)) {
      invalidUrls.push(url)
    } else {
      validUrls.push(url)
    }
  })
  
  const recommendations: string[] = []
  
  if (invalidUrls.length > 0) {
    recommendations.push('Retirer les URLs noindex du sitemap XML')
    recommendations.push('Vérifier la configuration des routes dans sitemapGenerator.ts')
  }
  
  if (invalidUrls.length === 0) {
    recommendations.push('Vérifier robots.txt pour bloquer les pages noindex')
    recommendations.push('S\'assurer que les pages 404 ont bien des balises noindex')
    recommendations.push('Contrôler les redirections automatiques qui peuvent créer des URLs alternatives')
  }
  
  const status = invalidUrls.length > 0 ? 'error' : 'success'
  
  return {
    sitemap: {
      totalUrls: sitemapUrls.length,
      validUrls,
      invalidUrls
    },
    recommendations,
    status
  }
}

async function checkProductionUrls(): Promise<void> {
  console.log('🌐 Vérification des URLs en production...\n')
  
  const testUrls = [
    'https://www.lelanation.fr/statistique',
    'https://www.lelanation.fr/dictionnaire/proposition', 
    'https://www.lelanation.fr/build/edit',
    'https://www.lelanation.fr/seo-audit',
    'https://www.lelanation.fr/page-inexistante-test-12345'
  ]
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url)
      const html = await response.text()
      const hasNoIndex = html.includes('noindex')
      const path = url.replace('https://www.lelanation.fr', '')
      
      console.log(`📄 ${path}:`)
      console.log(`   Status: ${response.status}`)
      console.log(`   NoIndex: ${hasNoIndex ? '✅' : '❌'}`)
      console.log(`   Expected NoIndex: ${isNoIndexRoute(path) ? 'Oui' : 'Non'}`)
      console.log('')
    } catch (error) {
      console.log(`❌ Erreur pour ${url}: ${error}`)
    }
  }
}

async function main() {
  console.log('🚀 Validation NoIndex et Sitemap\n')
  console.log('='.repeat(50))
  
  try {
    const validation = await validateNoIndexConfiguration()
    
    console.log('📊 Résultats de validation:')
    console.log(`   URLs dans le sitemap: ${validation.sitemap.totalUrls}`)
    console.log(`   URLs valides: ${validation.sitemap.validUrls.length}`)
    console.log(`   URLs problématiques: ${validation.sitemap.invalidUrls.length}`)
    console.log('')
    
    if (validation.sitemap.invalidUrls.length > 0) {
      console.log('❌ URLs noindex trouvées dans le sitemap:')
      validation.sitemap.invalidUrls.forEach(url => {
        console.log(`   - ${url}`)
      })
      console.log('')
    }
    
    console.log('💡 Recommandations:')
    validation.recommendations.forEach(rec => {
      console.log(`   • ${rec}`)
    })
    console.log('')
    
    await checkProductionUrls()
    
    console.log('='.repeat(50))
    
    if (validation.status === 'success') {
      console.log('✅ Configuration NoIndex correcte!')
      console.log('Les pages noindex ne sont pas dans le sitemap XML.')
      console.log('')
      console.log('🔧 Si l\'erreur SEO persiste, elle vient probablement de:')
      console.log('   1. Pages 404 avec noindex (normal)')
      console.log('   2. URLs alternatives découvertes par le crawler')
      console.log('   3. Cache des outils SEO (attendre 24-48h)')
    } else {
      console.log('❌ Configuration incorrecte!')
      console.log('Des pages noindex sont présentes dans le sitemap.')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

main() 