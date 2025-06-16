import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'

const execAsync = promisify(exec)

interface DuplicateIdReport {
  url: string
  duplicateIds: Array<{
    id: string
    count: number
    elements: string[]
  }>
}

interface ValidationSummary {
  totalPages: number
  pagesWithIssues: number
  totalDuplicateIds: number
  reports: DuplicateIdReport[]
}

class ProductionIdValidator {
  private readonly baseUrl = 'https://www.lelanation.fr'
  private readonly urlsToCheck = [
    '/',
    '/dictionnaire',
    '/dictionnaire/proposition',
    '/build',
    '/builds-publics',
    '/lelariva-builds',
    '/videos',
    '/legal'
  ]

  async validateAllPages(): Promise<ValidationSummary> {
    console.log('🔍 Validation des IDs en double sur les pages production...\n')
    
    const summary: ValidationSummary = {
      totalPages: 0,
      pagesWithIssues: 0,
      totalDuplicateIds: 0,
      reports: []
    }

    for (const path of this.urlsToCheck) {
      const fullUrl = `${this.baseUrl}${path}`
      console.log(`📄 Vérification: ${fullUrl}`)
      
      try {
        const report = await this.validatePage(fullUrl)
        summary.totalPages++
        
        if (report.duplicateIds.length > 0) {
          summary.pagesWithIssues++
          summary.totalDuplicateIds += report.duplicateIds.length
          summary.reports.push(report)
          
          console.log(`   ❌ ${report.duplicateIds.length} ID(s) en double trouvé(s):`)
          report.duplicateIds.forEach(dup => {
            console.log(`      • "${dup.id}" apparaît ${dup.count} fois`)
          })
        } else {
          console.log('   ✅ Aucun ID en double détecté')
        }
      } catch (error) {
        console.log(`   ⚠️  Erreur: ${error}`)
      }
      
      console.log('')
    }

    return summary
  }

  private async validatePage(url: string): Promise<DuplicateIdReport> {
    try {
      const { stdout: html } = await execAsync(`curl -s "${url}" --user-agent "Mozilla/5.0 (compatible; SEOBot/1.0; +https://www.lelanation.fr)"`)
      
      const duplicateIds = this.findDuplicateIds(html)
      
      return {
        url,
        duplicateIds
      }
    } catch (error) {
      throw new Error(`Impossible de charger ${url}: ${error}`)
    }
  }

  private findDuplicateIds(html: string): Array<{
    id: string
    count: number
    elements: string[]
  }> {
    const duplicates: Array<{
      id: string
      count: number
      elements: string[]
    }> = []

    const idRegex = /<[^>]+\s+id=["']([^"']+)["'][^>]*>/gi
    const idCounts = new Map<string, string[]>()
    
    let match
    while ((match = idRegex.exec(html)) !== null) {
      const id = match[1]
      const element = match[0]
      
      if (!idCounts.has(id)) {
        idCounts.set(id, [])
      }
      idCounts.get(id)!.push(element)
    }

    idCounts.forEach((elements, id) => {
      if (elements.length > 1) {
        duplicates.push({
          id,
          count: elements.length,
          elements: elements.map(el => {
            return el.length > 100 ? el.substring(0, 100) + '...' : el
          })
        })
      }
    })

    return duplicates
  }

  generateReport(summary: ValidationSummary): void {
    console.log('='.repeat(70))
    console.log('📊 RAPPORT DE VALIDATION - IDs EN DOUBLE (PRODUCTION)')
    console.log('='.repeat(70))
    
    console.log(`📈 Résumé:`)
    console.log(`   • Pages analysées: ${summary.totalPages}`)
    console.log(`   • Pages avec problèmes: ${summary.pagesWithIssues}`)
    console.log(`   • Total IDs en double: ${summary.totalDuplicateIds}`)
    
    if (summary.reports.length === 0) {
      console.log('\n🎉 Aucun ID en double trouvé sur les pages de production!')
      console.log('✅ Le site respecte les standards HTML pour les attributs ID')
    } else {
      console.log('\n❌ Problèmes détectés en production:')
      
      summary.reports.forEach(report => {
        console.log(`\n🔗 ${report.url}:`)
        report.duplicateIds.forEach(dup => {
          console.log(`   🚫 ID "${dup.id}" (${dup.count} occurrences):`)
          dup.elements.forEach((element, index) => {
            console.log(`      ${index + 1}. ${element}`)
          })
        })
      })
      
      console.log('\n💡 Actions recommandées:')
      console.log('   • Examiner les composants Vue qui génèrent ces IDs')
      console.log('   • Utiliser des IDs uniques avec Math.random() ou UUID')
      console.log('   • Vérifier les librairies tierces (Chart.js, etc.)')
      console.log('   • Corriger les conflits entre composants')
      console.log('   • Tester les corrections en local avant déploiement')
    }
    
    const reportFile = 'production-duplicate-ids-report.json'
    fs.writeFileSync(reportFile, JSON.stringify(summary, null, 2))
    console.log(`\n💾 Rapport détaillé sauvegardé: ${reportFile}`)
  }

  async checkSpecificPattern(): Promise<void> {
    console.log('\n🔍 Recherche de patterns problématiques spécifiques...')
    
    const problematicPatterns = [
      'ftoc-heading',
      'page-title',
      'search-input',
      'search-type',
      'chart-',
      'modal-',
      'form-'
    ]

    for (const pattern of problematicPatterns) {
      console.log(`\n🔎 Recherche du pattern "${pattern}":`)
      
      for (const path of this.urlsToCheck) {
        const fullUrl = `${this.baseUrl}${path}`
        
        try {
          const { stdout: html } = await execAsync(`curl -s "${fullUrl}" | grep -o 'id="[^"]*${pattern}[^"]*"' | sort | uniq -c | sort -nr`)
          
          if (html.trim()) {
            console.log(`   📄 ${path}:`)
            html.trim().split('\n').forEach(line => {
              const match = line.trim().match(/^\s*(\d+)\s+(.+)$/)
              if (match && parseInt(match[1]) > 1) {
                console.log(`      ❌ ${match[2]} (${match[1]} fois)`)
              }
            })
          }
        } catch {
        }
      }
    }
  }
}

async function main(): Promise<void> {
  const validator = new ProductionIdValidator()
  
  try {
    const summary = await validator.validateAllPages()
    
    await validator.checkSpecificPattern()
    
    validator.generateReport(summary)
    
    process.exit(summary.pagesWithIssues > 0 ? 1 : 0)
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
} 