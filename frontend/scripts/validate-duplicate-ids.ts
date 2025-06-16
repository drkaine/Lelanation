import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

interface DuplicateIdIssue {
  file: string
  id: string
  count: number
  elements: string[]
  lines: number[]
}

interface IdValidationResult {
  isValid: boolean
  issues: DuplicateIdIssue[]
  totalIds: number
}

class DuplicateIdValidator {
  private issues: DuplicateIdIssue[] = []

  validateFile(filePath: string): DuplicateIdIssue[] {
    const fileIssues: DuplicateIdIssue[] = []
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
      if (!templateMatch) return fileIssues
      
      const templateContent = templateMatch[1]
      const duplicateIds = this.findDuplicateIds(templateContent, content)
      
      duplicateIds.forEach(duplicate => {
        fileIssues.push({
          file: filePath,
          id: duplicate.id,
          count: duplicate.count,
          elements: duplicate.elements,
          lines: duplicate.lines
        })
      })
      
    } catch (error) {
      console.warn(`Erreur lors de la validation de ${filePath}:`, error)
    }
    
    return fileIssues
  }

  private findDuplicateIds(templateContent: string, fullContent: string): DuplicateIdIssue[] {
    const idOccurrences = new Map<string, { elements: string[], lines: number[] }>()
    
    const idRegexes = [
      /id="([^"]+)"/g,           
      /:id="([^"]+)"/g,          
      /v-bind:id="([^"]+)"/g     
    ]
    
    idRegexes.forEach(regex => {
      let match
      while ((match = regex.exec(templateContent)) !== null) {
        const idValue = match[1]
        const matchStart = match.index
        
        const beforeMatch = fullContent.substring(0, fullContent.indexOf(templateContent) + matchStart)
        const lineNumber = beforeMatch.split('\n').length
        
        const elementStart = templateContent.lastIndexOf('<', matchStart)
        const elementEnd = templateContent.indexOf('>', matchStart)
        const element = templateContent.substring(elementStart, elementEnd + 1)
        
        if (!idOccurrences.has(idValue)) {
          idOccurrences.set(idValue, { elements: [], lines: [] })
        }
        
        const occurrence = idOccurrences.get(idValue)!
        occurrence.elements.push(element)
        occurrence.lines.push(lineNumber)
      }
    })
    
    const duplicates: DuplicateIdIssue[] = []
    idOccurrences.forEach((occurrence, id) => {
      if (occurrence.elements.length > 1) {
        duplicates.push({
          file: '',
          id,
          count: occurrence.elements.length,
          elements: occurrence.elements,
          lines: occurrence.lines
        })
      }
    })
    
    return duplicates
  }

  validateDirectory(dirPath: string): IdValidationResult {
    const allIssues: DuplicateIdIssue[] = []
    let totalIds = 0
    
    const files = this.getVueFiles(dirPath)
    
    files.forEach(file => {
      const fileIssues = this.validateFile(file)
      allIssues.push(...fileIssues)
      
      try {
        const content = fs.readFileSync(file, 'utf-8')
        const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i)
        if (templateMatch) {
          const idMatches = templateMatch[1].match(/(?:^|\s)id="[^"]+"/g)
          totalIds += idMatches ? idMatches.length : 0
        }
      } catch (error) {
        console.warn(`Erreur lors de la validation de ${file}:`, error)
      }
    })
    
    return {
      isValid: allIssues.length === 0,
      issues: allIssues,
      totalIds
    }
  }

  private getVueFiles(dirPath: string): string[] {
    const vueFiles: string[] = []
    
    const scanDirectory = (currentPath: string) => {
      try {
        const items = fs.readdirSync(currentPath)
        
        items.forEach(item => {
          const fullPath = path.join(currentPath, item)
          const stat = fs.statSync(fullPath)
          
          if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
            scanDirectory(fullPath)
          } else if (stat.isFile() && item.endsWith('.vue')) {
            vueFiles.push(fullPath)
          }
        })
      } catch (error) {
        console.warn(`Erreur lors de la validation de ${currentPath}:`, error)
      }
    }
    
    scanDirectory(dirPath)
    return vueFiles
  }
}

class HTMLIdValidator {
  static validateHTMLContent(htmlContent: string, url?: string): DuplicateIdIssue[] {
    const issues: DuplicateIdIssue[] = []
    
    try {
      const $ = cheerio.load(htmlContent)
      const idCounts = new Map<string, { count: number, elements: string[] }>()

      $('[id]').each((_, element) => {
        const id = $(element).attr('id')
        if (id) {
          if (!idCounts.has(id)) {
            idCounts.set(id, { count: 0, elements: [] })
          }
          
          const data = idCounts.get(id)!
          data.count++
          data.elements.push(`<${element.tagName.toLowerCase()}${$(element).attr('class') ? ` class="${$(element).attr('class')}"` : ''} id="${id}">`)
        }
      })
      
      idCounts.forEach((data, id) => {
        if (data.count > 1) {
          issues.push({
            file: url || 'HTML Content',
            id,
            count: data.count,
            elements: data.elements,
            lines: [] 
          })
        }
      })
      
    } catch (error) {
      console.warn('Erreur lors de la validation HTML:', error)
    }
    
    return issues
  }
}

async function main() {
  console.log('🔍 Validation des attributs ID en double...\n')
  
  const validator = new DuplicateIdValidator()
  const sourceDir = path.join(process.cwd(), 'src')
  
  console.log('📄 Validation des composants Vue...')
  const result = validator.validateDirectory(sourceDir)
  
  if (result.issues.length === 0) {
    console.log(`✅ Aucun ID en double trouvé dans ${result.totalIds} IDs analysés`)
  } else {
    console.log(`❌ ${result.issues.length} problème(s) d'ID en double trouvé(s):\n`)
    
    result.issues.forEach(issue => {
      console.log(`🔴 ID "${issue.id}" utilisé ${issue.count} fois dans ${path.relative(process.cwd(), issue.file)}:`)
      issue.elements.forEach((element, index) => {
        console.log(`   ${index + 1}. ${element} (ligne ${issue.lines[index] || 'N/A'})`)
      })
      console.log('')
    })
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 RÉSUMÉ DE LA VALIDATION DES IDs')
  console.log('='.repeat(60))
  
  if (result.isValid) {
    console.log('🎉 Tous les attributs ID sont uniques!')
  } else {
    console.log(`⚠️  ${result.issues.length} problème(s) d'ID en double détecté(s)`)
    console.log('\n💡 Recommendations:')
    console.log('   • Utilisez des IDs uniques pour chaque élément')
    console.log('   • Évitez les IDs génériques comme "content", "main", etc.')
    console.log('   • Utilisez des préfixes spécifiques au composant')
    console.log('   • Préférez les classes CSS aux IDs quand possible')
    console.log('   • Validez les IDs dynamiques générés en Vue.js')
  }
  
  process.exit(result.isValid ? 0 : 1)
}

export { DuplicateIdValidator, HTMLIdValidator }

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
} 