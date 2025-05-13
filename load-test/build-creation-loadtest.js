import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Configuration variables
const BUILDS_API_URL = 'https://'; // Sera remplacé par le script shell

// Métriques personnalisées
const buildCreationDuration = new Trend('build_creation_duration');
const failedBuildCreations = new Counter('failed_build_creations');
const successfulBuildCreations = new Counter('successful_build_creations');

// Options de configuration du test
export const options = {
  stages: [
    { duration: '20s', target: 5 },    // Montée progressive à 5 utilisateurs
    { duration: '30s', target: 20 },   // Montée à 20 utilisateurs
    { duration: '1m', target: 50 },    // Test de charge avec 50 utilisateurs
    { duration: '20s', target: 0 },    // Diminution progressive
  ],
  thresholds: {
    'build_creation_duration': ['p(95)<3000'], // 95% des créations sous 3s
    'failed_build_creations': ['count<50'],    // Moins de 50 échecs
    'successful_build_creations': ['count>100'], // Au moins 100 créations réussies
    'http_req_duration': ['p(95)<3000'],  // 95% des requêtes sous 3s
    'http_req_failed': ['rate<0.1'],      // Moins de 10% d'erreurs
  },
};

// Liste des champions pour les tests
const champions = [
  'Ahri', 'Akali', 'Aatrox', 'Blitzcrank', 'Caitlyn', 'Darius', 
  'Ezreal', 'Fiora', 'Garen', 'Jinx', 'Leona', 'Lux', 
  'Miss Fortune', 'Morgana', 'Nasus', 'Teemo', 'Yasuo', 'Zed'
];

// Liste des items pour les tests
const items = [
  'Doran\'s Blade', 'Doran\'s Ring', 'Doran\'s Shield',
  'Infinity Edge', 'Rabadon\'s Deathcap', 'Trinity Force',
  'Bloodthirster', 'Guardian Angel', 'Zhonya\'s Hourglass',
  'Void Staff', 'Thornmail', 'Warmog\'s Armor'
];

// Runes pour les tests
const runes = [
  'Conqueror', 'Press the Attack', 'Lethal Tempo', 'Fleet Footwork',
  'Electrocute', 'Predator', 'Dark Harvest', 'Summon Aery',
  'Arcane Comet', 'Phase Rush', 'Grasp of the Undying', 'Aftershock'
];

// Fonction pour vérifier si la réponse JSON contient un ID
function responseContainsId(response) {
  try {
    const body = JSON.parse(response.body);
    
    // Log de débogage
    console.log(`Réponse du serveur: ${JSON.stringify(body).substring(0, 200)}...`);
    
    // Plusieurs cas de figure pour l'ID
    return (
      !!body.id || 
      !!body._id || 
      !!body.fileName || 
      !!body.name ||
      (body.message && body.message.includes("success")) ||
      (body.status && body.status === "success") ||
      (typeof body === 'string' && body.includes("success"))
    );
  } catch (e) {
    console.log(`Erreur de parsing JSON: ${e.message}, Corps: ${response.body.substring(0, 100)}`);
    // Si la réponse n'est pas du JSON mais contient "success", on considère que c'est bon
    if (typeof response.body === 'string' && response.body.includes("success")) {
      return true;
    }
    return false;
  }
}

export default function() {
  // Création d'un nom unique pour le build
  const buildName = `test-build-${__VU}-${Date.now()}`;
  
  // Sélection aléatoire d'un champion
  const randomChampion = champions[Math.floor(Math.random() * champions.length)];
  
  // Sélection aléatoire de 2-6 items
  const numItems = Math.floor(Math.random() * 5) + 2;
  const selectedItems = [];
  for (let i = 0; i < numItems; i++) {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    if (!selectedItems.includes(randomItem)) {
      selectedItems.push(randomItem);
    }
  }
  
  // Sélection aléatoire de 1-2 runes
  const numRunes = Math.floor(Math.random() * 2) + 1;
  const selectedRunes = [];
  for (let i = 0; i < numRunes; i++) {
    const randomRune = runes[Math.floor(Math.random() * runes.length)];
    if (!selectedRunes.includes(randomRune)) {
      selectedRunes.push(randomRune);
    }
  }
  
  // Deux formats de payload différents pour tester
  let buildPayload;
  
  if (Math.random() > 0.5) {
    // Format 1: avec fileName et content
    buildPayload = JSON.stringify({
      fileName: buildName,
      content: {
        champion: randomChampion,
        items: selectedItems,
        runes: selectedRunes,
        description: `Test build for ${randomChampion} created during load testing.`
      }
    });
  } else {
    // Format 2: structure plus simple
    buildPayload = JSON.stringify({
      name: buildName,
      champion: randomChampion,
      items: selectedItems,
      runes: selectedRunes,
      description: `Test build for ${randomChampion} created during load testing.`
    });
  }
  
  // Headers pour la requête
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Tester la création de builds normaux et lelariva (50/50)
  const useLelariva = Math.random() > 0.5;
  const endpoint = useLelariva ? 
    `${BUILDS_API_URL}/save/lelariva/${buildName}` : 
    `${BUILDS_API_URL}/save/${buildName}`;
  
  // Mesurer le temps de début
  const startTime = new Date().getTime();
  
  // Envoyer la requête de création de build
  const response = http.post(endpoint, buildPayload, { headers });
  
  // Calculer la durée
  const duration = new Date().getTime() - startTime;
  buildCreationDuration.add(duration);
  
  // Vérifier si la création a réussi
  const creationSuccessful = check(response, {
    'build_creation_successful': (r) => r.status === 200 || r.status === 201,
    'build_contains_id': (r) => responseContainsId(r),
  });
  
  if (creationSuccessful) {
    successfulBuildCreations.add(1);
    
    // Si la création a réussi, récupérons le build après une petite pause
    sleep(0.3);
    
    const getBuildResponse = http.get(
      useLelariva ? 
        `${BUILDS_API_URL}/build/lelariva/${buildName}` : 
        `${BUILDS_API_URL}/build/${buildName}`,
      { headers }
    );
    
    check(getBuildResponse, {
      'get_created_build_successful': (r) => r.status === 200,
      'get_created_build_contains_data': (r) => {
        try {
          const body = JSON.parse(r.body);
          // Accepter différentes structures de données
          return body && 
                (
                  (body.content && body.content.champion === randomChampion) || 
                  (body.data && body.data.champion === randomChampion) ||
                  (body.champion === randomChampion)
                );
        } catch (e) {
          console.log(`Erreur lors de la validation du build récupéré: ${e.message}`);
          return false;
        }
      }
    });
  } else {
    failedBuildCreations.add(1);
    console.log(`Échec de création du build - Status: ${response.status}, Body: ${response.body.substring(0, 200)}`);
  }
  
  // Pause entre les créations
  sleep(1);
} 