#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_CONFIG = {
  baseUrl: 'https://www.lelanation.fr',
  defaultChangefreq: 'weekly',
  defaultPriority: '0.5',
  lastmod: new Date().toISOString().split('T')[0] 
};

const PUBLIC_ROUTES = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily',
    image: {
      loc: 'https://www.lelanation.fr/assets/images/lelariva.webp',
      title: 'Lelariva - League of Legends Expert',
      caption: 'Profile image of Lelariva, League of Legends content creator'
    }
  },
  {
    path: '/build',
    priority: '0.9',
    changefreq: 'weekly',
    description: 'Créer un build League of Legends personnalisé'
  },
  {
    path: '/builds',
    priority: '0.8',
    changefreq: 'daily',
    description: 'Mes builds League of Legends personnalisés'
  },
  {
    path: '/builds-publics',
    priority: '0.9',
    changefreq: 'daily',
    description: 'Builds de la communauté League of Legends'
  },
  {
    path: '/Lebuildarriva',
    priority: '0.8',
    changefreq: 'daily',
    description: 'Builds officiels de Lelariva'
  },
  {
    path: '/videos',
    priority: '0.7',
    changefreq: 'weekly',
    description: 'Vidéos et contenu League of Legends'
  },
  {
    path: '/dictionnaire',
    priority: '0.8',
    changefreq: 'weekly',
    description: 'Dictionnaire Lelariva - Vocabulaire LoL'
  },
  {
    path: '/dictionnaire/proposition',
    priority: '0.6',
    changefreq: 'monthly',
    description: 'Proposer une nouvelle définition au dictionnaire'
  },
  {
    path: '/statistique',
    priority: '0.7',
    changefreq: 'daily',
    description: 'Statistiques League of Legends'
  },
  {
    path: '/legal',
    priority: '0.5',
    changefreq: 'monthly',
    description: 'Mentions légales et politique de confidentialité'
  }
];

function generateSitemapHeader() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
}

function generateUrlEntry(route) {
  const url = `${SITE_CONFIG.baseUrl}${route.path}`;
  const priority = route.priority || SITE_CONFIG.defaultPriority;
  const changefreq = route.changefreq || SITE_CONFIG.defaultChangefreq;
  
  let entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${SITE_CONFIG.lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

  if (route.image) {
    entry += `
    <image:image>
      <image:loc>${route.image.loc}</image:loc>
      <image:title>${route.image.title}</image:title>
      <image:caption>${route.image.caption}</image:caption>
    </image:image>`;
  }

  entry += `
  </url>`;

  return entry;
}

function generateSitemap() {
  let sitemap = generateSitemapHeader();
  
  PUBLIC_ROUTES.forEach(route => {
    sitemap += generateUrlEntry(route);
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

function saveSitemap() {
  const sitemap = generateSitemap();
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  try {
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    console.log('✅ Sitemap généré avec succès:', outputPath);
    console.log(`📄 ${PUBLIC_ROUTES.length} URLs incluses`);
    
    console.log('\n📋 URLs dans le sitemap:');
    PUBLIC_ROUTES.forEach(route => {
      console.log(`   ${SITE_CONFIG.baseUrl}${route.path} (${route.priority})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

function validateSitemap() {
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  if (!fs.existsSync(outputPath)) {
    console.error('❌ Le fichier sitemap.xml n\'existe pas');
    return false;
  }

  const content = fs.readFileSync(outputPath, 'utf8');
  
  const checks = [
    { test: content.includes('<?xml'), message: 'Déclaration XML' },
    { test: content.includes('<urlset'), message: 'Élément urlset' },
    { test: content.includes('</urlset>'), message: 'Fermeture urlset' },
    { test: content.split('<url>').length - 1 === PUBLIC_ROUTES.length, message: 'Nombre d\'URLs correct' }
  ];

  let isValid = true;
  checks.forEach(check => {
    if (check.test) {
      console.log(`✅ ${check.message}`);
    } else {
      console.log(`❌ ${check.message}`);
      isValid = false;
    }
  });

  return isValid;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Génération du sitemap.xml pour Lelanation\n');
  
  saveSitemap();
  
  console.log('\n🔍 Validation du sitemap...');
  if (validateSitemap()) {
    console.log('\n✅ Sitemap valide et prêt pour la production!');
    console.log('\n💡 Pour soumettre à Google:');
    console.log('   https://search.google.com/search-console');
    console.log('   https://www.lelanation.fr/sitemap.xml');
  } else {
    console.log('\n❌ Le sitemap contient des erreurs');
    process.exit(1);
  }
}

export { generateSitemap, PUBLIC_ROUTES, SITE_CONFIG }; 