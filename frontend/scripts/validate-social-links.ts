interface SocialLinkValidation {
  platform: string
  url: string
  found: boolean
  location: string[]
}

interface ValidationResult {
  totalPlatforms: number
  platformsFound: number
  validations: SocialLinkValidation[]
  summary: string
  recommendations: string[]
}

const REQUIRED_SOCIAL_PLATFORMS = [
  { platform: 'Twitter/X', url: 'https://x.com/Lelariva_fr', patterns: ['x.com/Lelariva_fr', 'twitter.com/Lelariva_fr'] },
  { platform: 'YouTube', url: 'https://www.youtube.com/@Lelariva_LoL/featured', patterns: ['youtube.com/@Lelariva_LoL', 'youtube.com/channel'] },
  { platform: 'Instagram', url: 'https://www.instagram.com/Lelariva_fr', patterns: ['instagram.com/Lelariva_fr'] },
  { platform: 'Twitch', url: 'https://www.twitch.tv/lelariva', patterns: ['twitch.tv/lelariva'] },
  { platform: 'TikTok', url: 'https://www.tiktok.com/@lelariva_fr', patterns: ['tiktok.com/@lelariva_fr'] },
]

async function validateSocialLinksInHTML(): Promise<ValidationResult> {
  console.log('🔍 Validation des liens sociaux dans le HTML...\n')
  
  try {
    const response = await fetch('https://www.lelanation.fr/')
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const html = await response.text()
    
    const validations: SocialLinkValidation[] = []
    
    REQUIRED_SOCIAL_PLATFORMS.forEach(platform => {
      const validation: SocialLinkValidation = {
        platform: platform.platform,
        url: platform.url,
        found: false,
        location: []
      }
      
      const hrefRegex = new RegExp(`href=["'][^"']*(?:${platform.patterns.join('|')})[^"']*["']`, 'gi')
      const hrefMatches = html.match(hrefRegex)
      
      if (hrefMatches) {
        validation.found = true
        validation.location.push(`Liens HTML (${hrefMatches.length})`)
      }
      
      const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis
      const jsonLdMatches = html.match(jsonLdRegex)
      
      if (jsonLdMatches) {
        jsonLdMatches.forEach(match => {
          const jsonContent = match.replace(/<\/?script[^>]*>/gi, '')
          platform.patterns.forEach(pattern => {
            if (jsonContent.includes(pattern)) {
              validation.found = true
              if (!validation.location.some(loc => loc.includes('JSON-LD'))) {
                validation.location.push('Données structurées JSON-LD')
              }
            }
          })
        })
      }
      
      platform.patterns.forEach(pattern => {
        if (html.includes(pattern)) {
          if (!validation.location.some(loc => loc.includes('Meta tags'))) {
            validation.location.push('Meta tags')
            validation.found = true
          }
        }
      })
      
      validations.push(validation)
    })
    
    const platformsFound = validations.filter(v => v.found).length
    const recommendations: string[] = []
    
    if (platformsFound < REQUIRED_SOCIAL_PLATFORMS.length) {
      recommendations.push('Ajouter des liens HTML directs vers les réseaux sociaux manquants')
      recommendations.push('Vérifier que les liens ne sont pas chargés uniquement par JavaScript')
      recommendations.push('Ajouter les URLs sociales dans les données structurées Schema.org')
    }
    
    if (platformsFound === 0) {
      recommendations.push('URGENT: Aucun lien social détecté - ajouter des liens visibles dans le HTML')
    }
    
    const summary = `
📊 Résultats de validation des liens sociaux:
   • Plateformes requises: ${REQUIRED_SOCIAL_PLATFORMS.length}
   • Plateformes détectées: ${platformsFound}
   • Taux de détection: ${Math.round((platformsFound / REQUIRED_SOCIAL_PLATFORMS.length) * 100)}%
    `
    
    return {
      totalPlatforms: REQUIRED_SOCIAL_PLATFORMS.length,
      platformsFound,
      validations,
      summary,
      recommendations
    }
    
  } catch (error) {
    throw new Error(`Erreur lors de la validation: ${error}`)
  }
}

async function main() {
  console.log('🚀 Validation des Liens Sociaux\n')
  console.log('='.repeat(50))
  
  try {
    const validation = await validateSocialLinksInHTML()
    
    console.log(validation.summary)
    
    console.log('📋 Détails par plateforme:')
    validation.validations.forEach(v => {
      const status = v.found ? '✅' : '❌'
      const locations = v.found ? ` (${v.location.join(', ')})` : ''
      console.log(`   ${status} ${v.platform}${locations}`)
    })
    
    console.log('')
    
    if (validation.platformsFound === validation.totalPlatforms) {
      console.log('🎉 Tous les liens sociaux sont détectés!')
      console.log('Les crawlers SEO peuvent trouver vos réseaux sociaux.')
    } else {
      console.log('⚠️ Liens sociaux manquants détectés')
      console.log('')
      console.log('💡 Recommandations:')
      validation.recommendations.forEach(rec => {
        console.log(`   • ${rec}`)
      })
      
      console.log('')
      console.log('🔧 Liens manquants:')
      validation.validations
        .filter(v => !v.found)
        .forEach(v => {
          console.log(`   • ${v.platform}: ${v.url}`)
        })
    }
    
    if (validation.platformsFound < 3) {
      console.log('\n❌ Validation échouée: Pas assez de liens sociaux détectés')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

main() 