
import fs from 'fs'
import { glob } from 'glob'

interface HeadingIssue {
  file: string
  issue: string
  severity: 'error' | 'warning'
  line?: number
}

interface HeadingStructure {
  level: number
  text: string
  line: number
}

class HeadingValidator {
  private issues: HeadingIssue[] = []
  
  validateFile(filePath: string): HeadingIssue[] {
    const fileIssues: HeadingIssue[] = []
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      const headings = this.extractHeadings(content)

      this.checkH1Requirements(headings, filePath, fileIssues)
      this.checkH2Presence(headings, filePath, fileIssues)
      this.checkHeadingHierarchy(headings, filePath, fileIssues)
      
    } catch (error) {
      fileIssues.push({
        file: filePath,
        issue: `Erreur de lecture du fichier: ${error}`,
        severity: 'error'
      })
    }
    
    return fileIssues
  }

  private extractHeadings(content: string): HeadingStructure[] {
    const headings: HeadingStructure[] = []
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
    
    let match
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1])
      const text = match[2]
        .replace(/<[^>]*>/g, '') 
        .replace(/\{\{[^}]*\}\}/g, '[i18n]') 
        .trim()
      
      const beforeMatch = content.substring(0, match.index)
      const line = beforeMatch.split('\n').length
      
      headings.push({ level, text, line })
    }
    
    return headings
  }

  private checkH1Requirements(headings: HeadingStructure[], filePath: string, issues: HeadingIssue[]): void {
    const h1s = headings.filter(h => h.level === 1)
    
    if (h1s.length === 0) {
      issues.push({
        file: filePath,
        issue: 'Aucun H1 trouvé - obligatoire pour le SEO',
        severity: 'error'
      })
    } else if (h1s.length > 1) {
      issues.push({
        file: filePath,
        issue: `${h1s.length} H1 trouvés - un seul recommandé pour le SEO`,
        severity: 'warning'
      })
      
      h1s.forEach((h1, index) => {
        if (index > 0) {
          issues.push({
            file: filePath,
            issue: `H1 additionnel: "${h1.text}"`,
            severity: 'warning',
            line: h1.line
          })
        }
      })
    }
  }

  private checkH2Presence(headings: HeadingStructure[], filePath: string, issues: HeadingIssue[]): void {
    const h2s = headings.filter(h => h.level === 2)
    
    const requiresH2 = [
      'View.vue',
      'Page.vue'
    ].some(pattern => filePath.includes(pattern))

    if (requiresH2 && h2s.length === 0) {
      const hasContent = headings.length > 1 || this.hasSignificantContent(filePath)
      
      if (hasContent) {
        issues.push({
          file: filePath,
          issue: 'Aucun H2 trouvé - recommandé pour structurer le contenu long',
          severity: 'warning'
        })
      }
    }
  }

  private checkHeadingHierarchy(headings: HeadingStructure[], filePath: string, issues: HeadingIssue[]): void {
    if (headings.length === 0) return
    
    if (headings[0].level !== 1) {
      issues.push({
        file: filePath,
        issue: `Premier titre devrait être H1, trouvé H${headings[0].level}`,
        severity: 'warning',
        line: headings[0].line
      })
    }
    
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i]
      const previous = headings[i - 1]
      
      if (current.level > previous.level + 1) {
        issues.push({
          file: filePath,
          issue: `Saut de niveau: H${previous.level} vers H${current.level} - utilisez H${previous.level + 1}`,
          severity: 'warning',
          line: current.line
        })
      }
    }
  }

  private hasSignificantContent(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
      if (!templateMatch) return false
      
      const templateContent = templateMatch[1]
      
      const contentElements = [
        /<p[^>]*>/gi,
        /<div[^>]*>/gi,
        /<section[^>]*>/gi,
        /<article[^>]*>/gi,
        /<form[^>]*>/gi,
        /<ul[^>]*>/gi,
        /<ol[^>]*>/gi
      ]
      
      let elementCount = 0
      contentElements.forEach(regex => {
        const matches = templateContent.match(regex)
        elementCount += matches ? matches.length : 0
      })
      
      return elementCount > 3 
    } catch {
      return false
    }
  }

  async validateAllViews(): Promise<void> {
    console.log('🔍 Validation de la structure des titres pour le SEO...\n')
    
    const viewFiles = await glob('frontend/src/views/**/*.vue')
    const componentFiles = await glob('frontend/src/components/**/*.vue')
    
    const allFiles = [...viewFiles, ...componentFiles]
    let totalIssues = 0
    
    for (const file of allFiles) {
      const issues = this.validateFile(file)
      
      if (issues.length > 0) {
        console.log(`\n📄 ${file}:`)
        issues.forEach(issue => {
          const icon = issue.severity === 'error' ? '❌' : '⚠️'
          const location = issue.line ? ` (ligne ${issue.line})` : ''
          console.log(`  ${icon} ${issue.issue}${location}`)
        })
        totalIssues += issues.length
      }
    }
    
    console.log('\n' + '='.repeat(60))
    
    if (totalIssues === 0) {
      console.log('✅ Aucun problème de structure de titres détecté !')
    } else {
      console.log(`\n📊 Résumé:`)
      console.log(`  • ${allFiles.length} fichiers analysés`)
      console.log(`  • ${totalIssues} problèmes détectés`)
      
      console.log('\n💡 Conseils SEO:')
      console.log('  • Un seul H1 par page (titre principal)')
      console.log('  • Utilisez des H2 pour structurer les sections')
      console.log('  • Respectez la hiérarchie: H1 → H2 → H3 → etc.')
      console.log('  • Les titres aident les moteurs de recherche à comprendre le contenu')
    }
    
    if (totalIssues > 0) {
      process.exit(1)
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new HeadingValidator()
  validator.validateAllViews().catch(console.error)
}

export { HeadingValidator } 