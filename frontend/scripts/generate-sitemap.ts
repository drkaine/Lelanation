#!/usr/bin/env tsx

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { generateLelanationSitemap } from '../src/utils/sitemapGenerator.js'

console.log('🗺️  Génération du sitemap en cours...')

try {
  const sitemapContent = generateLelanationSitemap()
  
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml')
  
  writeFileSync(sitemapPath, sitemapContent, 'utf-8')
  
  console.log('✅ Sitemap généré avec succès !')
  console.log(`📍 Emplacement: ${sitemapPath}`)
  
  const lines = sitemapContent.split('\n')
  const urlCount = (sitemapContent.match(/<url>/g) || []).length
  
  console.log(`📊 Statistiques:`)
  console.log(`   - ${urlCount} URL(s) ajoutées`)
  console.log(`   - ${lines.length} lignes générées`)
  console.log('')
  console.log('🚀 Le sitemap est prêt pour le déploiement !')
  
} catch (error) {
  console.error('❌ Erreur lors de la génération du sitemap:', error)
  process.exit(1)
} 