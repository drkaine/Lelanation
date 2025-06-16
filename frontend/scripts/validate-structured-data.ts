interface StructuredDataValidation {
  jsonLdCount: number
  microdataFound: boolean
  rdfaFound: boolean
  openGraphFound: boolean
  issues: string[]
  recommendations: string[]
}

async function validateStructuredDataFormats(): Promise<StructuredDataValidation> {
  console.log('🔍 Validation des formats de données structurées...\n')
  
  const result: StructuredDataValidation = {
    jsonLdCount: 0,
    microdataFound: false,
    rdfaFound: false,
    openGraphFound: false,
    issues: [],
    recommendations: []
  }
  
  try {
    const response = await fetch('https://www.lelanation.fr/')
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const html = await response.text()
    
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi)
    result.jsonLdCount = jsonLdMatches ? jsonLdMatches.length : 0
    
    const microdataPatterns = [
      /itemscope/gi,
      /itemtype/gi,
      /itemprop/gi
    ]
    
    result.microdataFound = microdataPatterns.some(pattern => pattern.test(html))
    
    const rdfaPatterns = [
      /typeof=/gi,
      /property=(?!["']og:)/gi, 
      /resource=/gi,
      /vocab=/gi
    ]
    
    result.rdfaFound = rdfaPatterns.some(pattern => pattern.test(html))
    
    result.openGraphFound = /property=["']og:/gi.test(html)
    
    const fs = await import('fs/promises')
    
    const indexHtml = await fs.readFile('./public/index.html', 'utf-8')
    const staticJsonLd = indexHtml.includes('application/ld+json')
    
    if (staticJsonLd) {
      result.issues.push('JSON-LD statique trouvé dans public/index.html')
      result.recommendations.push('Supprimer le JSON-LD statique de public/index.html')
    }
    
    try {
      const seoLayoutCode = await fs.readFile('./src/components/SEO/SEOLayout.vue', 'utf-8')
      const hasMicrodata = seoLayoutCode.includes('itemscope') || 
                          seoLayoutCode.includes('itemtype') || 
                          seoLayoutCode.includes('itemprop')
      
      if (hasMicrodata) {
        result.issues.push('Attributs Microdata trouvés dans SEOLayout.vue')
        result.recommendations.push('Supprimer les attributs itemscope, itemtype, itemprop de SEOLayout.vue')
      }
    } catch (error) {
      console.log(error)
    }
    
    if (result.jsonLdCount > 3) {
      result.issues.push(`Trop de blocs JSON-LD (${result.jsonLdCount}), risque de duplication`)
      result.recommendations.push('Consolider les données structurées JSON-LD')
    }
    
    if (result.microdataFound) {
      result.issues.push('Microdata détecté en conflit avec JSON-LD')
      result.recommendations.push('Supprimer tous les attributs Microdata (itemscope, itemtype, itemprop)')
    }
    
    if (result.rdfaFound) {
      result.issues.push('RDFa détecté en conflit avec JSON-LD')
      result.recommendations.push('Supprimer tous les attributs RDFa (typeof, property, resource, vocab)')
    }
    
    return result
    
  } catch (error) {
    throw new Error(`Erreur lors de la validation: ${error}`)
  }
}

async function main() {
  console.log('🚀 Validation des Formats de Données Structurées\n')
  console.log('='.repeat(60))
  
  try {
    const validation = await validateStructuredDataFormats()
    
    console.log('📊 Résultats de la validation:\n')
    
    console.log(`✅ Blocs JSON-LD détectés: ${validation.jsonLdCount}`)
    console.log(`${validation.microdataFound ? '❌' : '✅'} Microdata: ${validation.microdataFound ? 'Détecté' : 'Absent'}`)
    console.log(`${validation.rdfaFound ? '❌' : '✅'} RDFa: ${validation.rdfaFound ? 'Détecté' : 'Absent'}`)
    console.log(`ℹ️  OpenGraph: ${validation.openGraphFound ? 'Présent' : 'Absent'} (compatible)`)
    
    if (validation.issues.length > 0) {
      console.log('\n🔧 Problèmes détectés:')
      validation.issues.forEach(issue => {
        console.log(`   • ${issue}`)
      })
    }
    
    if (validation.recommendations.length > 0) {
      console.log('\n💡 Recommandations:')
      validation.recommendations.forEach(rec => {
        console.log(`   • ${rec}`)
      })
    } else {
      console.log('\n🎉 Format JSON-LD unique correctement implémenté!')
    }
    
    console.log('\n📋 Format recommandé:')
    console.log('   ✅ JSON-LD uniquement pour les données structurées')
    console.log('   ✅ OpenGraph pour les réseaux sociaux (compatible)')
    console.log('   ✅ Meta tags classiques pour les moteurs de recherche')
    console.log('   ❌ Pas de Microdata (itemscope, itemtype, itemprop)')
    console.log('   ❌ Pas de RDFa (typeof, property, resource, vocab)')
    
    if (validation.issues.length > 0) {
      console.log('\n❌ Validation échouée: Conflits de formats détectés')
      process.exit(1)
    } else {
      console.log('\n✅ Validation réussie: Format JSON-LD unique!')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

main() 