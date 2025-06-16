import fs from 'fs'
import { glob } from 'glob'

interface BundleAnalysis {
  totalSize: number
  largeFiles: Array<{
    file: string
    size: number
    sizeFormatted: string
    recommendations: string[]
  }>
  staticImports: Array<{
    file: string
    importedFile: string
    line: number
    size?: number
  }>
  optimizations: string[]
}

class BundleOptimizer {
  
  async analyzeBundles(): Promise<BundleAnalysis> {
    console.log('📊 Analyse des bundles JavaScript...\n')
    
    const analysis: BundleAnalysis = {
      totalSize: 0,
      largeFiles: [],
      staticImports: [],
      optimizations: []
    }
    
    await this.analyzeLargeJSONFiles(analysis)
    
    await this.analyzeStaticImports(analysis)
    
    await this.analyzeBuildBundles(analysis)
    
    return analysis
  }
  
  private async analyzeLargeJSONFiles(analysis: BundleAnalysis): Promise<void> {
    const jsonFiles = await glob('frontend/src/assets/files/**/*.json')
    
    for (const file of jsonFiles) {
      try {
        const stats = fs.statSync(file)
        const sizeKB = stats.size / 1024
        
        if (sizeKB > 25) { 
          analysis.largeFiles.push({
            file: file.replace('frontend/', ''),
            size: stats.size,
            sizeFormatted: this.formatFileSize(stats.size),
            recommendations: this.getRecommendations(file, stats.size)
          })
          analysis.totalSize += stats.size
        }
      } catch (error) {
        console.warn(`Erreur lors de l'analyse de ${file}:`, error)
      }
    }
  }
  
  private async analyzeStaticImports(analysis: BundleAnalysis): Promise<void> {
    const sourceFiles = await glob('frontend/src/**/*.{ts,vue}')
    
    for (const file of sourceFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          const importMatch = line.match(/import\s+.*\s+from\s+['"]([^'"]*\.json)['"]/)
          if (importMatch) {
            const importedFile = importMatch[1]
            
            if (this.isLargeJsonImport(importedFile)) {
              analysis.staticImports.push({
                file: file.replace('frontend/', ''),
                importedFile,
                line: index + 1
              })
            }
          }
        })
      } catch (error) {
        console.warn(`Erreur lors de l'analyse de ${file}:`, error)
      }
    }
  }
  
  private async analyzeBuildBundles(analysis: BundleAnalysis): Promise<void> {
    const distDir = 'frontend/dist/assets/js'
    
    if (fs.existsSync(distDir)) {
      const jsFiles = await glob(`${distDir}/*.js`)
      
      for (const file of jsFiles) {
        try {
          const stats = fs.statSync(file)
          const sizeKB = stats.size / 1024
          
          if (sizeKB > 25) {
            analysis.largeFiles.push({
              file: file.replace('frontend/dist/', ''),
              size: stats.size, 
              sizeFormatted: this.formatFileSize(stats.size),
              recommendations: ['Bundles trop volumineux après build']
            })
          }
        } catch (error) {
          console.warn(`Erreur lors de l'analyse de ${file}:`, error)
        }
      }
    }
  }
  
  private isLargeJsonImport(importPath: string): boolean {
    const largeFiles = [
      'championFull.json',
      'youtube.json', 
      'item.json',
      'runesReforged.json',
      'dictionnaire.json'
    ]
    
    return largeFiles.some(file => importPath.includes(file))
  }
  
  private getRecommendations(file: string, size: number): string[] {
    const recommendations: string[] = []
    const sizeKB = size / 1024
    
    if (file.includes('championFull.json')) {
      recommendations.push('Charger dynamiquement depuis une API')
      recommendations.push('Implémenter la pagination des champions')  
      recommendations.push('Compresser avec gzip/brotli')
    } else if (file.includes('youtube.json')) {
      recommendations.push('Charger les vidéos à la demande')
      recommendations.push('Implémenter la pagination')
      recommendations.push('Utiliser une API externe')
    } else if (file.includes('item.json')) {
      recommendations.push('Lazy loading par catégorie d\'objets')
      recommendations.push('Compression avancée')
    } else if (sizeKB > 100) {
      recommendations.push('Import dynamique obligatoire')
      recommendations.push('Chunking séparé')
    } else {
      recommendations.push('Import dynamique recommandé')
    }
    
    return recommendations
  }
  
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }
  
  async optimizeImports(): Promise<void> {
    console.log('🔧 Optimisation des imports...\n')
    
    const optimizations = [
      {
        file: 'src/views/DictionnaireView.vue',
        from: "import dictionnaire from '@/assets/files/dictionnaire/dictionnaire.json'",
        to: "// Lazy loaded in onMounted: const dictionnaire = await import('@/assets/files/dictionnaire/dictionnaire.json')"
      },
      {
        file: 'src/views/ShortView.vue', 
        from: "import youtubeData from '@/assets/files/data/youtube.json'",
        to: "// Lazy loaded in onMounted: const youtubeData = await import('@/assets/files/data/youtube.json')"
      }
    ]
    
    let totalOptimized = 0
    
    for (const opt of optimizations) {
      try {
        const filePath = `frontend/${opt.file}`
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8')
          
          if (content.includes(opt.from)) {
            content = content.replace(opt.from, opt.to)
            console.log(`✅ Optimisation suggérée pour ${opt.file}`)
            totalOptimized++
          }
        }
      } catch (error) {
        console.warn(`Erreur lors de l'optimisation de ${opt.file}:`, error)
      }
    }
    
    console.log(`📊 ${totalOptimized} optimisations suggérées`)
  }
  
  async generateOptimizedViteConfig(): Promise<string> {
    return `
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('championFull.json')) return 'champion-data'
          if (id.includes('youtube.json')) return 'youtube-data'  
          if (id.includes('item.json')) return 'item-data'
          if (id.includes('runesReforged.json')) return 'runes-data'
          if (id.includes('dictionnaire.json')) return 'dictionary-data'
          
          if (id.includes('node_modules/vue-i18n')) return 'vue-i18n'
          if (id.includes('node_modules/chart.js')) return 'charts'
          if (id.includes('node_modules/axios')) return 'http'
          if (id.includes('locales/')) return 'i18n-locales'
          
          if (id.includes('/views/')) {
            const viewMatch = id.match(/views\/([^/]+)\.vue/)
            if (viewMatch) return \`view-\${viewMatch[1].toLowerCase()}\`
          }
          
          if (id.includes('Selection/')) return 'selection-components'
          
          if (id.includes('Tooltip/')) return 'tooltip-components'
        },

        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name?.includes('data')) {
            return 'assets/data/[name]-[hash].js'
          }
          return 'assets/js/[name]-[hash].js'
        }
      }
    },
    
    chunkSizeWarningLimit: 25, 
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, 
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    }
  }
})
`
  }
  
  async generateReport(analysis: BundleAnalysis): Promise<void> {
    console.log('📋 RAPPORT D\'OPTIMISATION DES BUNDLES')
    console.log('=' .repeat(50))
    
    if (analysis.largeFiles.length > 0) {
      console.log('\n🚨 FICHIERS VOLUMINEUX DÉTECTÉS:')
      analysis.largeFiles.forEach(file => {
        console.log(`\n📄 ${file.file}`)
        console.log(`   Taille: ${file.sizeFormatted}`)
        console.log(`   Recommandations:`)
        file.recommendations.forEach(rec => {
          console.log(`   • ${rec}`)
        })
      })
    }
    
    if (analysis.staticImports.length > 0) {
      console.log('\n⚡ IMPORTS STATIQUES À OPTIMISER:')
      analysis.staticImports.forEach(imp => {
        console.log(`\n📄 ${imp.file}:${imp.line}`)
        console.log(`   Import: ${imp.importedFile}`)
        console.log(`   ➡️  Convertir en import dynamique`)
      })
    }
    
    console.log('\n🎯 PLAN D\'ACTION PRIORITAIRE:')
    console.log('\n1. Lazy Loading des gros JSON:')
    console.log('   • championFull.json (1.2MB) → Import dynamique + cache')
    console.log('   • youtube.json (497KB) → Pagination + API')
    console.log('   • item.json (554KB) → Chunking par catégorie')
    
    console.log('\n2. Optimisations Vite/Rollup:')
    console.log('   • Chunks séparés par fonctionnalité')
    console.log('   • Tree-shaking agressif')
    console.log('   • Compression Terser optimisée')
    
    console.log('\n3. Code Splitting:')
    console.log('   • Routes avec lazy loading')
    console.log('   • Components à la demande')
    console.log('   • Préchargement intelligent')
    
    console.log('\n4. Impact attendu:')
    console.log('   • Bundle initial: ~2MB → <100KB')
    console.log('   • Score SEO: +15-25 points')
    console.log('   • Time to Interactive: -50%')
    
    const totalSizeMB = analysis.totalSize / (1024 * 1024)
    if (totalSizeMB > 2) {
      console.log('\n❌ CRITIQUE: Bundle trop volumineux!')
      process.exit(1)
    } else if (totalSizeMB > 0.5) {
      console.log('\n⚠️  ATTENTION: Optimisations recommandées')
    } else {
      console.log('\n✅ Taille acceptable')
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new BundleOptimizer()
  
  optimizer.analyzeBundles()
    .then(analysis => {
      optimizer.generateReport(analysis)
      optimizer.optimizeImports()
    })
    .catch(console.error)
}

export { BundleOptimizer } 