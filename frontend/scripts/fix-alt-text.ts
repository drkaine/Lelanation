import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

interface ImageFix {
  file: string
  line: number
  originalContent: string
  fixedContent: string
  type: 'missing-alt' | 'empty-alt' | 'improve-alt'
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

function generateAltText(src: string, context: string): string {
  const match = src.match(/\/([^\/]+)\.(png|jpg|jpeg|webp|svg)/)
  if (!match) return 'Image'
  
  const filename = match[1]
  
  if (src.includes('/champions/')) {
    if (context.includes('champion?.name')) return context.includes('champion?.name') ? '${champion?.name}' : `Champion ${filename}`
    return `Portrait du champion ${filename}`
  }
  
  if (src.includes('/roles/')) {
    if (context.includes('role')) return '${role}'
    return `Icône du rôle ${filename}`
  }
  
  if (src.includes('/runes/')) {
    if (context.includes('runes.principal.name')) return '${runes.principal.name}'
    if (context.includes('runes.second.name')) return '${runes.second.name}'
    if (context.includes('getRuneAtIndex')) return '${getRuneAtIndex(index)?.name}'
    if (context.includes('getSecondaryRuneAtIndex')) return '${getSecondaryRuneAtIndex(index - 1)?.name}'
    return `Rune ${filename}`
  }
  
  if (src.includes('/summoners/')) {
    if (context.includes('getSummonerByType')) return '${getSummonerByType(type)?.name}'
    return `Sort d'invocateur ${filename}`
  }
  
  if (src.includes('/shards/')) {
    if (context.includes('getShardAtIndex')) return '${getShardAtIndex(index)?.description}'
    return `Fragment de rune ${filename}`
  }
  
  if (src.includes('/items/')) {
    if (context.includes('item.name')) return '${item.name}'
    return `Objet ${filename}`
  }
  
  if (src.includes('/skills/')) {
    return `Compétence ${filename}`
  }
  
  if (filename.includes('lelariva')) {
    return 'Certifié par Lelariva'
  }
  
  if (filename.includes('youtube') || filename.includes('thumbnail')) {
    return `Miniature vidéo ${filename}`
  }
  
  // Cas par défaut
  return `Image ${filename}`
}

function fixAltTextInFile(filePath: string): ImageFix[] {
  const fixes: ImageFix[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  let updatedContent = content
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1
    
    const imgWithoutAltMatch = line.match(/<img[^>]*src=([^>]+)(?![^>]*alt=)[^>]*\/?>/gi)
    if (imgWithoutAltMatch) {
      for (const match of imgWithoutAltMatch) {
        const srcMatch = match.match(/src=["']([^"']+)["']/)
        if (srcMatch) {
          const src = srcMatch[1]
          const altText = generateAltText(src, match)
          
          let fixedImg = match
          if (match.includes('/>')) {
            fixedImg = match.replace('/>', ` alt="${altText}" />`)
          } else {
            fixedImg = match.replace('>', ` alt="${altText}">`)
          }
          
          updatedContent = updatedContent.replace(match, fixedImg)
          
          fixes.push({
            file: filePath,
            line: lineNumber,
            originalContent: match,
            fixedContent: fixedImg,
            type: 'missing-alt'
          })
        }
      }
    }
    
    const imgWithEmptyAltMatch = line.match(/<img[^>]*alt=""[^>]*>/gi)
    if (imgWithEmptyAltMatch) {
      for (const match of imgWithEmptyAltMatch) {
        const srcMatch = match.match(/src=["']([^"']+)["']/)
        if (srcMatch) {
          const src = srcMatch[1]
          const altText = generateAltText(src, match)
          
          const fixedImg = match.replace('alt=""', `alt="${altText}"`)
          updatedContent = updatedContent.replace(match, fixedImg)
          
          fixes.push({
            file: filePath,
            line: lineNumber,
            originalContent: match,
            fixedContent: fixedImg,
            type: 'empty-alt'
          })
        }
      }
    }
  }
  
  const multilineImgRegex = /<img[^>]*$/gm
  let match
  while ((match = multilineImgRegex.exec(updatedContent)) !== null) {
    const startIndex = match.index
    const startLineNumber = updatedContent.substring(0, startIndex).split('\n').length
    
    let endIndex = startIndex
    let depth = 0
    let foundSrc = false
    let foundAlt = false
    let srcValue = ''
    
    for (let j = startIndex; j < updatedContent.length; j++) {
      const char = updatedContent[j]
      
      if (char === '<') depth++
      if (char === '>') {
        depth--
        if (depth === 0) {
          endIndex = j
          break
        }
      }
      
      const currentContent = updatedContent.substring(startIndex, j + 1)
      if (!foundSrc) {
        const srcMatch = currentContent.match(/src=["']([^"']+)["']/)
        if (srcMatch) {
          foundSrc = true
          srcValue = srcMatch[1]
        }
      }
      
      if (!foundAlt && currentContent.includes('alt=')) {
        foundAlt = true
      }
    }
    
    if (foundSrc && !foundAlt && endIndex > startIndex) {
      const fullImgTag = updatedContent.substring(startIndex, endIndex + 1)
      const altText = generateAltText(srcValue, fullImgTag)
      
      let fixedImg = fullImgTag
      if (fullImgTag.includes('/>')) {
        fixedImg = fullImgTag.replace('/>', `\n            alt="${altText}"\n          />`)
      } else {
        fixedImg = fullImgTag.replace('>', `\n            alt="${altText}"\n          >`)
      }
      
      updatedContent = updatedContent.replace(fullImgTag, fixedImg)
      
      fixes.push({
        file: filePath,
        line: startLineNumber,
        originalContent: fullImgTag,
        fixedContent: fixedImg,
        type: 'missing-alt'
      })
    }
  }
  
  if (fixes.length > 0) {
    writeFileSync(filePath, updatedContent, 'utf-8')
  }
  
  return fixes
}

async function main() {
  console.log('🚀 Correction Automatique des Alt Text\n')
  console.log('='.repeat(60))
  
  try {
    const sourceDir = join(process.cwd(), 'src')
    const vueFiles = findVueFiles(sourceDir)
    
    console.log(`🔍 Analyse de ${vueFiles.length} fichiers Vue...\n`)
    
    let totalFixes = 0
    let filesFixed = 0
    const allFixes: ImageFix[] = []
    
    for (const file of vueFiles) {
      const fixes = fixAltTextInFile(file)
      if (fixes.length > 0) {
        filesFixed++
        totalFixes += fixes.length
        allFixes.push(...fixes)
      }
    }
    
    console.log('📊 Résultats de la correction:\n')
    console.log(`✅ Fichiers analysés: ${vueFiles.length}`)
    console.log(`🔧 Fichiers corrigés: ${filesFixed}`)
    console.log(`📝 Total des corrections: ${totalFixes}`)
    
    if (totalFixes === 0) {
      console.log('\n🎉 Aucune correction nécessaire!')
      console.log('Tous les attributs alt sont présents et corrects.')
    } else {
      console.log('\n📄 Détail des corrections:')
      
      const fixesByFile = allFixes.reduce((acc, fix) => {
        const relativePath = fix.file.replace(process.cwd(), '.')
        if (!acc[relativePath]) acc[relativePath] = []
        acc[relativePath].push(fix)
        return acc
      }, {} as Record<string, ImageFix[]>)
      
      Object.entries(fixesByFile).forEach(([file, fixes]) => {
        console.log(`\n🔧 ${file}:`)
        fixes.forEach(fix => {
          const typeEmoji = fix.type === 'missing-alt' ? '➕' : fix.type === 'empty-alt' ? '🔄' : '✨'
          console.log(`   ${typeEmoji} Ligne ${fix.line}: ${fix.type.replace('-', ' ')}`)
        })
      })
      
      console.log('\n💡 Conseils d\'accessibilité:')
      console.log('   • Alt text descriptif pour les images informatives')
      console.log('   • Alt="" pour les images décoratives')
      console.log('   • Description de l\'action pour les images cliquables')
      console.log('   • Tests avec lecteurs d\'écran recommandés')
    }
    
    console.log('\n✅ Correction terminée!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error)
    process.exit(1)
  }
}

main() 