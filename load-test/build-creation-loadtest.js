import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const BUILDS_API_URL = 'https://'; 

const buildCreationDuration = new Trend('build_creation_duration');
const failedBuildCreations = new Counter('failed_build_creations');
const successfulBuildCreations = new Counter('successful_build_creations');

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

const champions = [
  'Ahri', 'Akali', 'Aatrox', 'Blitzcrank', 'Caitlyn', 'Darius', 
  'Ezreal', 'Fiora', 'Garen', 'Jinx', 'Leona', 'Lux', 
  'Miss Fortune', 'Morgana', 'Nasus', 'Teemo', 'Yasuo', 'Zed'
];

const items = [
  'Doran\'s Blade', 'Doran\'s Ring', 'Doran\'s Shield',
  'Infinity Edge', 'Rabadon\'s Deathcap', 'Trinity Force',
  'Bloodthirster', 'Guardian Angel', 'Zhonya\'s Hourglass',
  'Void Staff', 'Thornmail', 'Warmog\'s Armor'
];

const runes = [
  'Conqueror', 'Press the Attack', 'Lethal Tempo', 'Fleet Footwork',
  'Electrocute', 'Predator', 'Dark Harvest', 'Summon Aery',
  'Arcane Comet', 'Phase Rush', 'Grasp of the Undying', 'Aftershock'
];

function responseContainsId(response) {
  try {
    const body = JSON.parse(response.body);
    
    console.log(`Réponse du serveur: ${JSON.stringify(body).substring(0, 200)}...`);
    
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
  
    if (typeof response.body === 'string' && response.body.includes("success")) {
      return true;
    }
    return false;
  }
}

export default function() {
  const buildName = `test-build-${__VU}-${Date.now()}`;
  
  const randomChampion = champions[Math.floor(Math.random() * champions.length)];
  
  const numItems = Math.floor(Math.random() * 5) + 2;
  const selectedItems = [];
  for (let i = 0; i < numItems; i++) {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    if (!selectedItems.includes(randomItem)) {
      selectedItems.push(randomItem);
    }
  }
  
  const numRunes = Math.floor(Math.random() * 2) + 1;
  const selectedRunes = [];
  for (let i = 0; i < numRunes; i++) {
    const randomRune = runes[Math.floor(Math.random() * runes.length)];
    if (!selectedRunes.includes(randomRune)) {
      selectedRunes.push(randomRune);
    }
  }
  
  let buildPayload;
  
  if (Math.random() > 0.5) {
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
    buildPayload = JSON.stringify({
      name: buildName,
      champion: randomChampion,
      items: selectedItems,
      runes: selectedRunes,
      description: `Test build for ${randomChampion} created during load testing.`
    });
  }
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const useLelariva = Math.random() > 0.5;
  const endpoint = useLelariva ? 
    `${BUILDS_API_URL}/save/lelariva/${buildName}` : 
    `${BUILDS_API_URL}/save/${buildName}`;
  
  const startTime = new Date().getTime();
  
  const response = http.post(endpoint, buildPayload, { headers });
  
  const duration = new Date().getTime() - startTime;
  buildCreationDuration.add(duration);
  
  const creationSuccessful = check(response, {
    'build_creation_successful': (r) => r.status === 200 || r.status === 201,
    'build_contains_id': (r) => responseContainsId(r),
  });
  
  if (creationSuccessful) {
    successfulBuildCreations.add(1);
    
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
  
  sleep(1);
} 