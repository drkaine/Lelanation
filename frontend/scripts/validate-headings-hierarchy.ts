import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'

const execAsync = promisify(exec)

interface HeadingIssue {
  level: number
  text: string
  reason: string
  expectedLevel?: number
}

interface PageHeadingAnalysis {
  url: string
  headings: Array<{
    level: number
    text: string
    line?: number
  }>
  issues: HeadingIssue[]
}

interface HeadingValidationReport {
  totalPages: number
  pagesWithIssues: number
  totalIssues: number
  analyses: PageHeadingAnalysis[]
}

class HeadingHierarchyValidator {
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

  async validateAllPages(): Promise<HeadingValidationReport> {
    console.log('🔍 Validation de la hiérarchie des titres sur les pages production...\n')
    
    const report: HeadingValidationReport = {
      totalPages: 0,
      pagesWithIssues: 0,
      totalIssues: 0,
      analyses: []
    }

    for (const path of this.urlsToCheck) {
      const fullUrl = `${this.baseUrl}${path}`
      console.log(`📄 Analyse: ${fullUrl}`)
      
      try {
        const analysis = await this.analyzePage(fullUrl)
        report.totalPages++
        
        if (analysis.issues.length > 0) {
          report.pagesWithIssues++
          report.totalIssues += analysis.issues.length
          report.analyses.push(analysis)
          
          console.log(`   ❌ ${analysis.issues.length} problème(s) de hiérarchie:`)
          analysis.issues.forEach(issue => {
            const expectedText = issue.expectedLevel ? ` (attendu: H${issue.expectedLevel})` : ''
            console.log(`      • H${issue.level}: "${issue.text}" - ${issue.reason}${expectedText}`)
          })
        } else {
          console.log('   ✅ Hiérarchie des titres correcte')
        }
      } catch (error) {
        console.log(`   ⚠️  Erreur: ${error}`)
      }
      
      console.log('')
    }

    return report
  }

  private async analyzePage(url: string): Promise<PageHeadingAnalysis> {
    try {
      const { stdout: html } = await execAsync(`curl -s "${url}" --user-agent "Mozilla/5.0 (compatible; SEOBot/1.0; +https://www.lelanation.fr)"`)
      
      const headings = this.extractHeadings(html)
      
      const issues = this.validateHeadingHierarchy(headings)
      
      return {
        url,
        headings,
        issues
      }
    } catch (error) {
      throw new Error(`Impossible d'analyser ${url}: ${error}`)
    }
  }

  private extractHeadings(html: string): Array<{
    level: number
    text: string
    line?: number
  }> {
    const headings: Array<{
      level: number
      text: string
      line?: number
    }> = []

    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
    
    let match
    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1])
      const rawText = match[2]
      
      const text = rawText
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      if (text.length > 0) {
        headings.push({
          level,
          text: text.length > 100 ? text.substring(0, 100) + '...' : text
        })
      }
    }

    return headings
  }

  private validateHeadingHierarchy(headings: Array<{
    level: number
    text: string
  }>): HeadingIssue[] {
    const issues: HeadingIssue[] = []
    
    if (headings.length === 0) {
      return issues
    }

    const h1Count = headings.filter(h => h.level === 1).length
    if (h1Count === 0) {
      issues.push({
        level: 1,
        text: '',
        reason: 'Aucun H1 trouvé sur la page'
      })
    } else if (h1Count > 1) {
      issues.push({
        level: 1,
        text: '',
        reason: `${h1Count} H1 trouvés, un seul recommandé`
      })
    }

    if (headings[0] && headings[0].level !== 1) {
      issues.push({
        level: headings[0].level,
        text: headings[0].text,
        reason: 'Le premier titre devrait être H1',
        expectedLevel: 1
      })
    }

    let expectedLevel = 1
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]
      
      if (heading.level > expectedLevel + 1) {
        issues.push({
          level: heading.level,
          text: heading.text,
          reason: `Saut de niveau détecté`,
          expectedLevel: expectedLevel <= 6 ? expectedLevel : expectedLevel + 1
        })
      }
      
      expectedLevel = Math.max(expectedLevel, heading.level)
    }

    return issues
  }

  generateReport(report: HeadingValidationReport): void {
    console.log('='.repeat(70))
    console.log('📊 RAPPORT DE VALIDATION - HIÉRARCHIE DES TITRES')
    console.log('='.repeat(70))
    
    console.log(`📈 Résumé:`)
    console.log(`   • Pages analysées: ${report.totalPages}`)
    console.log(`   • Pages avec problèmes: ${report.pagesWithIssues}`)
    console.log(`   • Total problèmes détectés: ${report.totalIssues}`)
    
    if (report.analyses.length === 0) {
      console.log('\n🎉 Toutes les pages respectent la hiérarchie des titres!')
      console.log('✅ Structure des headings conforme aux bonnes pratiques SEO')
    } else {
      console.log('\n❌ Problèmes de hiérarchie détectés:')
      
      report.analyses.forEach(analysis => {
        console.log(`\n🔗 ${analysis.url}:`)
        
        console.log('   📋 Structure actuelle:')
        analysis.headings.forEach((heading) => {
          const indent = '  '.repeat(heading.level - 1)
          console.log(`      ${indent}H${heading.level}: "${heading.text}"`)
        })
        
        console.log('   🚫 Problèmes:')
        analysis.issues.forEach(issue => {
          const expectedText = issue.expectedLevel ? ` → devrait être H${issue.expectedLevel}` : ''
          console.log(`      • H${issue.level}: ${issue.reason}${expectedText}`)
        })
      })
      
      console.log('\n💡 Recommandations pour corriger:')
      console.log('   • Ajoutez les niveaux de titres manquants (H2, H3, etc.)')
      console.log('   • Respectez la hiérarchie: H1 → H2 → H3 → H4 → H5 → H6')
      console.log('   • Un seul H1 par page (titre principal)')
      console.log('   • Utilisez les H2 pour structurer les sections principales')
      console.log('   • Les H3+ pour les sous-sections')
      console.log('   • Évitez de sauter des niveaux (H1 → H3 directement)')
    }
    
    const reportFile = 'headings-hierarchy-report.json'
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
    console.log(`\n💾 Rapport détaillé sauvegardé: ${reportFile}`)
  }

  async generateFixingSuggestions(report: HeadingValidationReport): Promise<void> {
    if (report.analyses.length === 0) return
    
    console.log('\n🔧 SUGGESTIONS DE CORRECTION SPÉCIFIQUES:')
    
    report.analyses.forEach(analysis => {
      console.log(`\n📄 ${analysis.url}:`)
      
      const missingLevels = this.findMissingLevels(analysis.headings)
      if (missingLevels.length > 0) {
        console.log(`   • Niveaux manquants: H${missingLevels.join(', H')}`)
        console.log(`   • Solution: Ajouter des titres intermédiaires ou réorganiser`)
      }
      
      const pageName = analysis.url.split('/').pop() || 'index'
       
      this.generatePageSpecificSuggestions(pageName, analysis)
    })
  }

  private findMissingLevels(headings: Array<{ level: number; text: string }>): number[] {
    if (headings.length === 0) return []
    
    const presentLevels = new Set(headings.map(h => h.level))
    const maxLevel = Math.max(...headings.map(h => h.level))
    const missing: number[] = []
    
    for (let level = 1; level <= maxLevel; level++) {
      if (!presentLevels.has(level)) {
        missing.push(level)
      }
    }
    
    return missing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generatePageSpecificSuggestions(pageName: string, _analysis: PageHeadingAnalysis): void {
    switch (pageName) {
      case 'dictionnaire':
        console.log('   • Ajouter H2 pour "Recherche" et "Résultats"')
        console.log('   • Structurer les définitions avec des H3 si nécessaire')
        break
      case 'videos':
        console.log('   • Ajouter H2 pour "Vidéos récentes" et "Catégories"')
        break
      case 'build':
        console.log('   • Ajouter H2 pour "Étapes de création" et "Configuration"')
        break
      case 'legal':
        console.log('   • Structurer avec H2 pour chaque section légale')
        console.log('   • Utiliser H3 pour les sous-sections des CGU/Confidentialité')
        break
      default:
        console.log('   • Analyser le contenu et ajouter des H2 pour les sections principales')
    }
  }
}

async function main(): Promise<void> {
  const validator = new HeadingHierarchyValidator()  
  
  try {
    const report = await validator.validateAllPages()
    
    validator.generateReport(report)
    
    await validator.generateFixingSuggestions(report)
    
    process.exit(report.pagesWithIssues > 0 ? 1 : 0)
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
} 