
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface AltTextIssue {
  file: string
  line: number
  issue: string
  context: string
  severity: 'high' | 'medium' | 'low'
}

function findVueFiles(dir: string): string[] {
  const files: string[] = []
  
  function traverseDirectory(currentDir: string) {
    const items = readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = join(currentDir, item)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        if (!item.startsWith('.') && item !== 'node_modules') {
          traverseDirectory(fullPath)
        }
      } else if (item.endsWith('.vue')) {
        files.push(fullPath)
      }
    }
  }
  
  traverseDirectory(dir)
  return files
}

function validateVueAltText(filePath: string): AltTextIssue[] {
  const issues: AltTextIssue[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('<!--')) {
      continue
    }
    
    const imgMatches = trimmedLine.match(/<img[^>]*>/g)
    if (imgMatches) {
      for (const imgTag of imgMatches) {
        const hasStaticAlt = /\salt="[^"]*"/.test(imgTag)
        const hasDynamicAlt = /\s:alt="[^"]*"/.test(imgTag)
        const hasEmptyAlt = /\salt=""/.test(imgTag)
        const hasRole = /\srole="[^"]*"/.test(imgTag)
        
        if (!hasStaticAlt && !hasDynamicAlt) {
          const isDecorative = hasRole && imgTag.includes('role="presentation"')
          const isProbablyFunctional = imgTag.includes('onclick') || 
                                      imgTag.includes('@click') ||
                                      line.includes('router-link') ||
                                      imgTag.includes('button')
          
          let severity: 'high' | 'medium' | 'low' = 'medium'
          if (isProbablyFunctional) severity = 'high'
          if (isDecorative) severity = 'low'
          
          issues.push({
            file: filePath,
            line: lineNumber,
            issue: 'Image sans attribut alt',
            context: imgTag,
            severity
          })
        } else if (hasEmptyAlt && !hasRole) {
          issues.push({
            file: filePath,
            line: lineNumber,
            issue: 'Alt vide sans role="presentation"',
            context: imgTag,
            severity: 'medium'
          })
        }
      }
    }
    
    if (trimmedLine.startsWith('<img') && !trimmedLine.includes('>')) {
      let fullImgTag = trimmedLine
      let j = i + 1
      
      while (j < lines.length && !lines[j].includes('>')) {
        fullImgTag += ' ' + lines[j].trim()
        j++
      }
      if (j < lines.length) {
        fullImgTag += ' ' + lines[j].trim()
      }
      
      const hasStaticAlt = /\salt="[^"]*"/.test(fullImgTag)
      const hasDynamicAlt = /\s:alt="[^"]*"/.test(fullImgTag)
      const hasEmptyAlt = /\salt=""/.test(fullImgTag)
      
      if (!hasStaticAlt && !hasDynamicAlt) {
        issues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Image multiligne sans attribut alt',
          context: fullImgTag.substring(0, 100) + '...',
          severity: 'medium'
        })
      } else if (hasEmptyAlt) {
        issues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Image multiligne avec alt vide',
          context: fullImgTag.substring(0, 100) + '...',
          severity: 'medium'
        })
      }
    }
  }
  
  return issues
}

function validateProjectAltText(): {
  totalFiles: number
  filesWithIssues: number
  totalIssues: number
  issues: AltTextIssue[]
  summary: string
} {
  console.log('🔍 Validation des attributs alt Vue.js...\n')
  
  const sourceDir = join(process.cwd(), 'src')
  const vueFiles = findVueFiles(sourceDir)
  
  let allIssues: AltTextIssue[] = []
  let filesWithIssues = 0
  
  vueFiles.forEach(file => {
    const issues = validateVueAltText(file)
    if (issues.length > 0) {
      filesWithIssues++
      allIssues = allIssues.concat(issues)
    }
  })
  
  const highSeverityIssues = allIssues.filter(i => i.severity === 'high').length
  const mediumSeverityIssues = allIssues.filter(i => i.severity === 'medium').length
  const lowSeverityIssues = allIssues.filter(i => i.severity === 'low').length
  
  const summary = `
📊 Résultats de validation Alt Text Vue.js:
   • Fichiers Vue analysés: ${vueFiles.length}
   • Fichiers avec problèmes: ${filesWithIssues}
   • Total des problèmes: ${allIssues.length}
   • Critiques (🔴): ${highSeverityIssues}
   • Moyens (🟡): ${mediumSeverityIssues}
   • Mineurs (⚪): ${lowSeverityIssues}
  `
  
  return {
    totalFiles: vueFiles.length,
    filesWithIssues,
    totalIssues: allIssues.length,
    issues: allIssues,
    summary
  }
}

async function main() {
  console.log('🚀 Validation Accessibilité Vue.js - Attributs Alt\n')
  console.log('='.repeat(60))
  
  try {
    const validation = validateProjectAltText()
    
    console.log(validation.summary)
    
    if (validation.totalIssues === 0) {
      console.log('✅ Aucun problème d\'attribut alt détecté!')
      console.log('Toutes les images ont des descriptions appropriées.')
    } else {
      console.log('🔧 Problèmes détectés par fichier:\n')
      
      const issuesByFile = validation.issues.reduce((acc, issue) => {
        const relativePath = issue.file.replace(process.cwd(), '.')
        if (!acc[relativePath]) acc[relativePath] = []
        acc[relativePath].push(issue)
        return acc
      }, {} as Record<string, AltTextIssue[]>)
      
      Object.entries(issuesByFile).forEach(([file, issues]) => {
        console.log(`📄 ${file}:`)
        issues.forEach(issue => {
          const severityEmoji = issue.severity === 'high' ? '🔴' : 
                               issue.severity === 'medium' ? '🟡' : '⚪'
          console.log(`   ${severityEmoji} Ligne ${issue.line}: ${issue.issue}`)
          console.log(`      Code: ${issue.context.trim()}`)
          console.log('')
        })
      })
      
      console.log('💡 Guide de correction:')
      console.log('   🔴 Critiques - Images cliquables/fonctionnelles sans alt')
      console.log('      → Ajouter :alt="description de l\'action"')
      console.log('   🟡 Moyens - Images informatives sans alt')  
      console.log('      → Ajouter :alt="description du contenu"')
      console.log('   ⚪ Mineurs - Images décoratives')
      console.log('      → Ajouter alt="" et role="presentation"')
      console.log('')
      console.log('📋 Exemples de correction:')
      console.log('   • Champion: :alt="champion?.name"')
      console.log('   • Objet: :alt="item.name"') 
      console.log('   • Rôle: :alt="`Rôle ${role}`"')
      console.log('   • Décoratif: alt="" role="presentation"')
      
      const criticalCount = validation.issues.filter(i => i.severity === 'high').length
      if (criticalCount > 0) {
        console.log(`\n⚠️  ${criticalCount} problème(s) critique(s) à corriger en priorité!`)
        process.exit(1)
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

main() 