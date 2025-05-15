const fs = require('fs');
const path = require('path');

const fr = require('../frontend/src/i18n/locales/fr.json');
const en = require('../frontend/src/i18n/locales/en.json');
const laranguiva = require('../frontend/src/i18n/locales/laranguiva.json');

function getAllKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getAllKeys(value, currentKey);
    }
    return [currentKey];
  });
}

const frKeys = new Set(getAllKeys(fr));
const enKeys = new Set(getAllKeys(en));
const larangKeys = new Set(getAllKeys(laranguiva));

console.log('=== CLÉS MANQUANTES ===');

console.log('\nClés dans fr.json mais pas dans en.json:');
Array.from(frKeys).filter(k => !enKeys.has(k)).forEach(k => console.log(`- ${k}`));

console.log('\nClés dans fr.json mais pas dans laranguiva.json:');
Array.from(frKeys).filter(k => !larangKeys.has(k)).forEach(k => console.log(`- ${k}`));

console.log('\nClés dans en.json mais pas dans fr.json:');
Array.from(enKeys).filter(k => !frKeys.has(k)).forEach(k => console.log(`- ${k}`));

console.log('\nClés dans en.json mais pas dans laranguiva.json:');
Array.from(enKeys).filter(k => !larangKeys.has(k)).forEach(k => console.log(`- ${k}`));

console.log('\nClés dans laranguiva.json mais pas dans fr.json:');
Array.from(larangKeys).filter(k => !frKeys.has(k)).forEach(k => console.log(`- ${k}`));

console.log('\nClés dans laranguiva.json mais pas dans en.json:');
Array.from(larangKeys).filter(k => !enKeys.has(k)).forEach(k => console.log(`- ${k}`)); 