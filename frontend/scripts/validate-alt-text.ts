import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface AltTextIssue {
  file: string
  line: number
  issue: string
  context: string
}

function findVueFiles(dir: string): string[] {
  const files: string[] = []
  
  function traverseDir(currentDir: string) {
    const items = readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = join(currentDir, item)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverseDir(fullPath)
      } else if (item.endsWith('.vue')) {
        files.push(fullPath)
      }
    }
  }
  
  traverseDir(dir)
  return files
}

function validateAltText(filePath: string): AltTextIssue[] {
  const issues: AltTextIssue[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1
    const trimmedLine = line.trim()
    
    // Vérifier les images avec alt vides
    if (/alt=""/.test(trimmedLine) && /<img/.test(trimmedLine)) {
      issues.push({
        file: filePath,
        line: lineNumber,
        issue: 'Image avec alt vide',
        context: trimmedLine
      })
    }
    
    // Vérifier les images sans alt du tout
    if (/<img/.test(trimmedLine) && !/alt=/.test(trimmedLine)) {
      issues.push({
        file: filePath,
        line: lineNumber,
        issue: 'Image sans attribut alt',
        context: trimmedLine
      })
    }
    
    if (/(<a|<button|<router-link).*<img/.test(trimmedLine) || 
        (/<img/.test(trimmedLine) && lines[Math.max(0, index - 2)].includes('router-link'))) {
      if (/alt=""/.test(trimmedLine) || !/alt=/.test(trimmedLine)) {
        issues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Image cliquable avec alt vide ou manquant',
          context: trimmedLine
        })
      }
    }
    
    if (/<img/.test(trimmedLine) && /@click/.test(trimmedLine)) {
      if (/alt=""/.test(trimmedLine) || !/alt=/.test(trimmedLine)) {
        issues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Image cliquable avec alt vide ou manquant',
          context: trimmedLine
        })
      }
    }
  })
  
  return issues
}

function validateProjectAltText(): {
  totalFiles: number
  filesWithIssues: number
  totalIssues: number
  issues: AltTextIssue[]
  summary: string
} {
  console.log('🔍 Validation des attributs alt des images...\n')
  
  const sourceDir = join(process.cwd(), 'src')
  const vueFiles = findVueFiles(sourceDir)
  
  let allIssues: AltTextIssue[] = []
  let filesWithIssues = 0
  
  vueFiles.forEach(file => {
    const issues = validateAltText(file)
    if (issues.length > 0) {
      filesWithIssues++
      allIssues = allIssues.concat(issues)
    }
  })
  
  const summary = `
📊 Résultats de validation Alt Text:
   • Fichiers Vue analysés: ${vueFiles.length}
   • Fichiers avec problèmes: ${filesWithIssues}
   • Total des problèmes: ${allIssues.length}
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
  console.log('🚀 Validation Accessibilité - Attributs Alt\n')
  console.log('='.repeat(50))
  
  try {
    const validation = validateProjectAltText()
    
    console.log(validation.summary)
    
    if (validation.totalIssues === 0) {
      console.log('✅ Aucun problème d\'attribut alt détecté!')
      console.log('Toutes les images ont des descriptions appropriées.')
    } else {
      console.log('❌ Problèmes détectés:')
      console.log('')
      
      const issuesByFile = validation.issues.reduce((acc, issue) => {
        const relativePath = issue.file.replace(process.cwd(), '.')
        if (!acc[relativePath]) acc[relativePath] = []
        acc[relativePath].push(issue)
        return acc
      }, {} as Record<string, AltTextIssue[]>)
      
      Object.entries(issuesByFile).forEach(([file, issues]) => {
        console.log(`📄 ${file}:`)
        issues.forEach(issue => {
          console.log(`   Ligne ${issue.line}: ${issue.issue}`)
          console.log(`   Code: ${issue.context.trim()}`)
          console.log('')
        })
      })
      
      console.log('💡 Recommandations:')
      console.log('   • Ajoutez des attributs alt descriptifs pour toutes les images')
      console.log('   • Pour les images décoratives, utilisez alt="" avec role="presentation"')
      console.log('   • Pour les images cliquables, décrivez l\'action ou la destination')
      console.log('   • Pour les icônes fonctionnelles, décrivez leur fonction')
      
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
    process.exit(1)
  }
}

main() 