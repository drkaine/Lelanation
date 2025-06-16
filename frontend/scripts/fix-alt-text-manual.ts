import { readFileSync, writeFileSync } from 'fs'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CORRECTIONS = [
  {
    file: 'src/views/CommuBuildsView.vue',
    search: /(<img[^>]*class="role-icon"[^>]*>)/g,
    needsAlt: (content: string) => !content.includes('alt=')
  },
  {
    file: 'src/views/MesBuildsView.vue', 
    search: /(<img[^>]*class="role-icon"[^>]*>)/g,
    needsAlt: (content: string) => !content.includes('alt=')
  },
  {
    file: 'src/views/ShortView.vue',
    search: /(<img[^>]*src=[^>]*youtube[^>]*>)/g,
    needsAlt: (content: string) => !content.includes('alt=')
  }
]

function addMissingAltAttributes(): void {
  console.log('🔧 Correction manuelle des attributs alt manquants...\n')
  
  let totalFixes = 0
  
  const filesToFix = [
    'src/components/Tooltip/ChampionTooltip.vue',
    'src/components/Tooltip/ItemTooltip.vue', 
    'src/components/composants/SheetBuild.vue',
    'src/components/composants/SkillUp.vue',
    'src/views/StatistiqueView.vue'
  ]
  
  filesToFix.forEach(file => {
    try {
      let content = readFileSync(file, 'utf-8')
      let modified = false
      
      content = content.replace(
        /<img\s+:src="`\/assets\/icons\/items\/\$\{item\.image\.full\}`"\s*\/>/g,
        '<img :src="`/assets/icons/items/${item.image.full}`" :alt="item.name" />'
      )
      if (content !== readFileSync(file, 'utf-8')) modified = true
      
      content = content.replace(
        /<img\s+:src="`\/assets\/icons\/champions\/\$\{champion\.image\.full\}`"\s*\/>/g,
        '<img :src="`/assets/icons/champions/${champion.image.full}`" :alt="champion.name" />'
      )
      
      content = content.replace(
        /<img\s+:src="`\/assets\/icons\/runes\/\$\{([^}]+)\}\.png`"\s*\/>/g,
        '<img :src="`/assets/icons/runes/${$1}.png`" :alt="rune.name || \'Rune\'" />'
      )
      
      content = content.replace(
        /<img\s+:src="`\/assets\/icons\/summoners\/\$\{([^}]+)\}`"\s*\/>/g,
        '<img :src="`/assets/icons/summoners/${$1}`" :alt="summoner.name || \'Sort d\'invocateur\'" />'
      )
      
      content = content.replace(
        /<img\s+:src="([^"]*youtube[^"]*|[^"]*thumbnail[^"]*)"\s*\/>/g,
        '<img :src="$1" alt="Miniature vidéo" />'
      )
      
      if (modified) {
        writeFileSync(file, content, 'utf-8')
        totalFixes++
        console.log(`✅ Corrigé: ${file}`)
      }
      
    } catch (error) {
      console.log(`⚠️  Impossible de traiter ${file}: ${error}`)
    }
  })
  
  const specificFixes = [
    {
      file: 'src/components/composants/SheetBuild.vue',
      replacements: [
        {
          search: /<img\s*(?=[\s\S]*?:src="`\/assets\/icons\/champions\/\$\{champion\?\.image\.full\}`")(?![\s\S]*?alt=)[\s\S]*?\/>/g,
          replace: `<img
            :src="\`/assets/icons/champions/\${champion?.image.full}\`"
            :alt="champion?.name || 'Champion'"
          />`
        },
        {
          search: /<img\s*(?=[\s\S]*?:src="`\/assets\/icons\/roles\/\$\{role\}\.png`")(?![\s\S]*?alt=)[\s\S]*?\/>/g,
          replace: `<img
              :src="\`/assets/icons/roles/\${role}.png\`"
              :alt="\`Rôle \${role}\`"
              :style="{
                width: isMobile ? '25px' : '30px',
                height: isMobile ? '25px' : '30px',
              }"
            />`
        }
      ]
    }
  ]
  
  specificFixes.forEach(({ file, replacements }) => {
    try {
      let content = readFileSync(file, 'utf-8')
      let modified = false
      
      replacements.forEach(({ search, replace }) => {
        const newContent = content.replace(search, replace)
        if (newContent !== content) {
          content = newContent
          modified = true
        }
      })
      
      if (modified) {
        writeFileSync(file, content, 'utf-8')
        totalFixes++
        console.log(`✅ Corrections spécifiques appliquées: ${file}`)
      }
      
    } catch (error) {
      console.log(`⚠️  Impossible de traiter ${file}: ${error}`)
    }
  })
  
  console.log(`\n📊 Total des fichiers corrigés: ${totalFixes}`)
  console.log('✅ Correction terminée!')
}

function fixMultilineImages(): void {
  console.log('\n🔧 Correction des images multilignes...')
  
  const filesToCheck = [
    'src/components/composants/SheetBuild.vue',
    'src/components/Tooltip/ChampionTooltip.vue',
    'src/components/Tooltip/ItemTooltip.vue'
  ]
  
  filesToCheck.forEach(file => {
    try {
      const content = readFileSync(file, 'utf-8')
      const lines = content.split('\n')
      let modified = false
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        if (line.startsWith('<img') && !line.includes('/>') && !line.includes('alt=')) {
          let j = i + 1
          let imgBlock = line
          let hasAlt = false
          
          while (j < lines.length && !lines[j].includes('/>')) {
            imgBlock += '\n' + lines[j]
            if (lines[j].includes('alt=')) {
              hasAlt = true
            }
            j++
          }
          
          if (j < lines.length) {
            imgBlock += '\n' + lines[j]
          }
          
          if (!hasAlt && imgBlock.includes('src=')) {
            const srcMatch = imgBlock.match(/src=["']([^"']+)["']/)
            if (srcMatch) {
              const src = srcMatch[1]
              let altText = 'Image'
              
              if (src.includes('champions')) altText = 'Champion'
              else if (src.includes('items')) altText = 'Objet'
              else if (src.includes('runes')) altText = 'Rune'
              else if (src.includes('roles')) altText = 'Rôle'
              else if (src.includes('summoners')) altText = 'Sort d\'invocateur'
              else if (src.includes('skills')) altText = 'Compétence'
              
              const altLine = `            alt="${altText}"`
              lines.splice(j, 0, altLine)
              modified = true
              console.log(`  ➕ Ajouté alt="${altText}" ligne ${j + 1}`)
            }
          }
        }
      }
      
      if (modified) {
        writeFileSync(file, lines.join('\n'), 'utf-8')
        console.log(`✅ Corrigé: ${file}`)
      }
      
    } catch (error) {
      console.log(`⚠️  Erreur avec ${file}: ${error}`)
    }
  })
}

addMissingAltAttributes()
fixMultilineImages()

console.log('\n🎉 Correction des alt text terminée!')
console.log('💡 Lancez validate-alt-text.ts pour vérifier les résultats.') 