#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SiteConfig {
  baseUrl: string;
  defaultChangefreq: string;
  defaultPriority: string;
  lastmod: string;
}

interface ImageInfo {
  loc: string;
  title: string;
  caption: string;
}

interface RouteInfo {
  path: string;
  priority: string;
  changefreq: string;
  description?: string;
  image?: ImageInfo;
}

const SITE_CONFIG: SiteConfig = {
  baseUrl: 'https://www.lelanation.fr',
  defaultChangefreq: 'weekly',
  defaultPriority: '0.5',
  lastmod: new Date().toISOString().split('T')[0] 
};

const PRIVATE_ROUTES: string[] = [
  '/builds',
  '/statistique',
  '/dictionnaire/proposition'
];

const ALLOWED_ROUTES: string[] = [
  '/',
  '/build',
  '/builds-publics', 
  '/Lebuildarriva',
  '/videos',
  '/dictionnaire',
  '/legal',
  ...PRIVATE_ROUTES
];

function validateRoute(routePath: string): boolean {
  if (!ALLOWED_ROUTES.includes(routePath)) {
    throw new Error(`Route non autorisée détectée: ${routePath}. Routes autorisées: ${ALLOWED_ROUTES.join(', ')}`);
  }
  return true;
}

function validateCanonicalUrl(url: string): string {
  if (!url.startsWith('https://www.lelanation.fr')) {
    throw new Error(`URL non canonique détectée: ${url}. Toutes les URLs doivent commencer par https://www.lelanation.fr`);
  }
  
  const routePath = url.replace('https://www.lelanation.fr', '') || '/';
  validateRoute(routePath);
  
  if (url !== 'https://www.lelanation.fr/' && url.endsWith('/')) {
    throw new Error(`URL avec slash final détectée: ${url}. Les URLs ne doivent pas se terminer par un slash.`);
  }
  
  if (url.includes('//') && !url.startsWith('https://')) {
    throw new Error(`Double slash détecté dans l'URL: ${url}`);
  }
  
  const forbiddenChars = ['?', '#', ' ', '%'];
  for (const char of forbiddenChars) {
    if (routePath.includes(char)) {
      throw new Error(`Caractère interdit '${char}' détecté dans l'URL: ${url}`);
    }
  }
  
  if (routePath !== routePath.toLowerCase() && routePath !== '/Lebuildarriva') {
    throw new Error(`URL avec majuscules détectée: ${url}. Les URLs doivent être en minuscules (exception: /Lebuildarriva).`);
  }
  
  return url;
}

const PUBLIC_ROUTES: RouteInfo[] = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
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
    path: '/builds-publics',
    priority: '0.9',
    changefreq: 'daily',
    description: 'Builds de la communauté League of Legends'
  },
  {
    path: '/Lebuildarriva',
    priority: '0.8',
    changefreq: 'daily',
    description: 'Builds officiels de Lelariva - Expert League of Legends'
  },
  {
    path: '/videos',
    priority: '0.7',
    changefreq: 'weekly',
    description: 'Vidéos et contenu League of Legends'
  },
  {
    path: '/dictionnaire',
    priority: '0.7',
    changefreq: 'monthly',
    description: 'Dictionnaire Lelariva - Vocabulaire LoL'
  },
  {
    path: '/legal',
    priority: '0.3',
    changefreq: 'yearly',
    description: 'Mentions légales et politique de confidentialité'
  }
];

function generateSitemapHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
}

function generateUrlEntry(route: RouteInfo): string {
  const url = validateCanonicalUrl(`${SITE_CONFIG.baseUrl}${route.path}`);
  const priority = route.priority || SITE_CONFIG.defaultPriority;
  const changefreq = route.changefreq || SITE_CONFIG.defaultChangefreq;
  
  let entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${SITE_CONFIG.lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

  if (route.image) {
    if (!route.image.loc.startsWith('https://www.lelanation.fr')) {
      throw new Error(`URL d'image non canonique: ${route.image.loc}`);
    }
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

function generateSitemap(): string {
  let sitemap = generateSitemapHeader();
  
  PUBLIC_ROUTES.forEach(route => {
    sitemap += generateUrlEntry(route);
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

function saveSitemap(): void {
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

interface ValidationCheck {
  test: boolean;
  message: string;
}

function validateSitemap(): boolean {
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  if (!fs.existsSync(outputPath)) {
    console.error('❌ Le fichier sitemap.xml n\'existe pas');
    return false;
  }

  const content = fs.readFileSync(outputPath, 'utf8');
  
  const basicChecks: ValidationCheck[] = [
    { test: content.includes('<?xml'), message: 'Déclaration XML' },
    { test: content.includes('<urlset'), message: 'Élément urlset' },
    { test: content.includes('</urlset>'), message: 'Fermeture urlset' },
    { test: content.split('<url>').length - 1 === PUBLIC_ROUTES.length, message: 'Nombre d\'URLs correct' }
  ];

  let isValid = true;
  
  basicChecks.forEach(check => {
    if (check.test) {
      console.log(`✅ ${check.message}`);
    } else {
      console.log(`❌ ${check.message}`);
      isValid = false;
    }
  });

  const urlMatches = content.match(/<loc>(.*?)<\/loc>/g);
  if (urlMatches) {
    console.log('\n🔍 Validation des URLs canoniques:');
    urlMatches.forEach((match: string, index: number) => {
      const url = match.replace('<loc>', '').replace('</loc>', '');
      try {
        validateCanonicalUrl(url);
        console.log(`✅ URL ${index + 1}: ${url}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.log(`❌ URL ${index + 1}: ${url} - ${errorMessage}`);
        isValid = false;
      }
    });
  }

  return isValid;
}

// Exécution du script si appelé directement
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

export { generateSitemap, PUBLIC_ROUTES, SITE_CONFIG, type RouteInfo, type SiteConfig }; 