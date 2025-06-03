#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types pour les objets de traduction
type TranslationValue = string | TranslationObject;
type TranslationObject = Record<string, TranslationValue>;

interface ComparisonResult {
  missingInTarget: string[];
  extraInSource: string[];
}

interface TranslationFiles {
  fr: TranslationObject;
  en: TranslationObject;
  laranguiva: TranslationObject;
}

// Chargement des fichiers de traduction
function loadTranslationFiles(): TranslationFiles {
  const basePath = path.join(__dirname, '..', 'frontend', 'src', 'i18n', 'locales');
  
  try {
    const fr = JSON.parse(fs.readFileSync(path.join(basePath, 'fr.json'), 'utf8')) as TranslationObject;
    const en = JSON.parse(fs.readFileSync(path.join(basePath, 'en.json'), 'utf8')) as TranslationObject;
    const laranguiva = JSON.parse(fs.readFileSync(path.join(basePath, 'laranguiva.json'), 'utf8')) as TranslationObject;
    
    return { fr, en, laranguiva };
  } catch (error) {
    console.error('❌ Erreur lors du chargement des fichiers de traduction:', error);
    process.exit(1);
  }
}

// Fonction récursive pour extraire toutes les clés d'un objet de traduction
function getAllKeys(obj: TranslationObject, prefix: string = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getAllKeys(value as TranslationObject, currentKey);
    }
    return [currentKey];
  });
}

// Fonction pour comparer deux ensembles de clés
function compareKeys(sourceKeys: Set<string>, targetKeys: Set<string>): ComparisonResult {
  const missingInTarget = Array.from(sourceKeys).filter(k => !targetKeys.has(k));
  const extraInSource = Array.from(targetKeys).filter(k => !sourceKeys.has(k));
  
  return { missingInTarget, extraInSource };
}

// Fonction pour afficher les résultats de comparaison
function displayComparison(
  title: string, 
  sourceKeys: Set<string>, 
  targetKeys: Set<string>, 
  showExtra: boolean = false
): void {
  const comparison = compareKeys(sourceKeys, targetKeys);
  
  console.log(`\n${title}:`);
  if (comparison.missingInTarget.length > 0) {
    comparison.missingInTarget.forEach(k => console.log(`- ${k}`));
  } else {
    console.log('✅ Aucune clé manquante');
  }
  
  if (showExtra && comparison.extraInSource.length > 0) {
    console.log(`\nClés supplémentaires dans la cible:`);
    comparison.extraInSource.forEach(k => console.log(`+ ${k}`));
  }
}

// Fonction pour générer un rapport détaillé
function generateDetailedReport(translations: TranslationFiles): void {
  const frKeys = new Set(getAllKeys(translations.fr));
  const enKeys = new Set(getAllKeys(translations.en));
  const larangKeys = new Set(getAllKeys(translations.laranguiva));

  console.log('🔍 === ANALYSE DÉTAILLÉE DES TRADUCTIONS ===\n');
  
  console.log(`📊 Statistiques:
  - Clés FR: ${frKeys.size}
  - Clés EN: ${enKeys.size}
  - Clés Laranguiva: ${larangKeys.size}`);

  console.log('\n🔍 === CLÉS MANQUANTES ===');

  displayComparison(
    'Clés dans fr.json mais pas dans en.json',
    frKeys,
    enKeys
  );

  displayComparison(
    'Clés dans fr.json mais pas dans laranguiva.json',
    frKeys,
    larangKeys
  );

  displayComparison(
    'Clés dans en.json mais pas dans fr.json',
    enKeys,
    frKeys
  );

  displayComparison(
    'Clés dans en.json mais pas dans laranguiva.json',
    enKeys,
    larangKeys
  );

  displayComparison(
    'Clés dans laranguiva.json mais pas dans fr.json',
    larangKeys,
    frKeys
  );

  displayComparison(
    'Clés dans laranguiva.json mais pas dans en.json',
    larangKeys,
    enKeys
  );

  // Vérification de la cohérence
  const allKeysConsistent = (
    frKeys.size === enKeys.size && 
    enKeys.size === larangKeys.size &&
    Array.from(frKeys).every(key => enKeys.has(key) && larangKeys.has(key))
  );

  console.log(`\n🎯 === STATUT DE COHÉRENCE ===`);
  if (allKeysConsistent) {
    console.log('✅ Toutes les traductions sont cohérentes !');
  } else {
    console.log('⚠️  Des incohérences détectées entre les fichiers de traduction');
    
    // Identification des fichiers les plus complets
    const maxKeys = Math.max(frKeys.size, enKeys.size, larangKeys.size);
    if (frKeys.size === maxKeys) console.log('📄 Le fichier FR semble le plus complet');
    if (enKeys.size === maxKeys) console.log('📄 Le fichier EN semble le plus complet');
    if (larangKeys.size === maxKeys) console.log('📄 Le fichier Laranguiva semble le plus complet');
  }
}

// Fonction pour exporter les clés manquantes vers un fichier
function exportMissingKeys(translations: TranslationFiles): void {
  const frKeys = new Set(getAllKeys(translations.fr));
  const enKeys = new Set(getAllKeys(translations.en));
  const larangKeys = new Set(getAllKeys(translations.laranguiva));

  const missingReport = {
    timestamp: new Date().toISOString(),
    statistics: {
      fr: frKeys.size,
      en: enKeys.size,
      laranguiva: larangKeys.size
    },
    missing: {
      'en_missing_from_fr': Array.from(frKeys).filter(k => !enKeys.has(k)),
      'laranguiva_missing_from_fr': Array.from(frKeys).filter(k => !larangKeys.has(k)),
      'fr_missing_from_en': Array.from(enKeys).filter(k => !frKeys.has(k)),
      'laranguiva_missing_from_en': Array.from(enKeys).filter(k => !larangKeys.has(k)),
      'fr_missing_from_laranguiva': Array.from(larangKeys).filter(k => !frKeys.has(k)),
      'en_missing_from_laranguiva': Array.from(larangKeys).filter(k => !enKeys.has(k))
    }
  };

  const outputPath = path.join(__dirname, 'translation-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(missingReport, null, 2));
  console.log(`\n📝 Rapport détaillé exporté vers: ${outputPath}`);
}

// Exécution principale
function main(): void {
  console.log('🌐 === COMPARATEUR DE TRADUCTIONS LELANATION ===\n');
  
  const translations = loadTranslationFiles();
  generateDetailedReport(translations);
  exportMissingKeys(translations);
  
  console.log('\n🎉 Analyse terminée !');
}

// Exécution du script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { 
  loadTranslationFiles, 
  getAllKeys, 
  compareKeys, 
  generateDetailedReport,
  type TranslationObject,
  type TranslationFiles,
  type ComparisonResult
}; 