import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const failedRequests = new Counter('failed_requests');
const successRate = new Rate('page_load_success');

export const options = {
  stages: [
    // Montée progressive à 50 utilisateurs simultanés
    { duration: '30s', target: 50 },
    // Maintien de 50 utilisateurs simultanés pendant 1 minute
    { duration: '1m', target: 50 },
    // Montée à 100 utilisateurs
    { duration: '30s', target: 100 },
    // Maintien de 100 utilisateurs pendant 2 minutes
    { duration: '2m', target: 100 },
    // Test de charge avec 200 utilisateurs pendant 1 minute
    { duration: '1m', target: 200 },
    // Redescendre à 0 utilisateurs
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% des requêtes doivent répondre en moins de 2s
    http_req_failed: ['rate<0.1'],     // Moins de 10% d'erreurs
    'failed_requests': ['count<500'],  // Moins de 500 requêtes échouées au total
    'page_load_success': ['rate>0.9'], // Taux de succès > 90%
  },
};

const BASE_URL = 'https:/r';

export default function() {
  let homeRes = http.get(`${BASE_URL}/`);
  const homeSuccess = check(homeRes, {
    'homepage_status_200': (r) => r.status === 200,
    'homepage_contains_title': (r) => r.body.includes('Lelanation'),
  });
  
  successRate.add(homeSuccess);
  if (!homeSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 2 + 1); // Pause aléatoire entre 1 et 3 secondes
  
  let championsRes = http.get(`${BASE_URL}/champions`);
  const championsSuccess = check(championsRes, {
    'champions_status_200': (r) => r.status === 200,
    'champions_loaded': (r) => r.body.includes('champion'),
  });
  
  successRate.add(championsSuccess);
  if (!championsSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 2 + 1); // Pause aléatoire entre 1 et 3 secondes
  
  const champions = ['Ahri', 'Yasuo', 'Lux', 'Zed', 'Jinx', 'Kaisa', 'Aatrox', 'Darius'];
  const randomChampion = champions[Math.floor(Math.random() * champions.length)];
  
  let championDetailRes = http.get(`${BASE_URL}/champion/${randomChampion}`);
  const championDetailSuccess = check(championDetailRes, {
    'champion_detail_status_200': (r) => r.status === 200,
    'champion_detail_loaded': (r) => r.body.includes(randomChampion),
  });
  
  successRate.add(championDetailSuccess);
  if (!championDetailSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 3 + 2); // Pause aléatoire entre 2 et 5 secondes (lecture de la page du champion)
  
  let createBuildRes = http.get(`${BASE_URL}/build/create`);
  const createBuildSuccess = check(createBuildRes, {
    'create_build_page_status_200': (r) => r.status === 200,
    'create_build_loaded': (r) => r.body.includes('build') || r.body.includes('Build'),
  });
  
  successRate.add(createBuildSuccess);
  if (!createBuildSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 3 + 2);
  
  let buildsRes = http.get(`${BASE_URL}/builds`);
  const buildsSuccess = check(buildsRes, {
    'builds_status_200': (r) => r.status === 200,
    'builds_loaded': (r) => r.body.includes('build') || r.body.includes('Build'),
  });
  
  successRate.add(buildsSuccess);
  if (!buildsSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 2 + 1);
  
  let tierListRes = http.get(`${BASE_URL}/tierlist`);
  const tierListSuccess = check(tierListRes, {
    'tierlist_status_200': (r) => r.status === 200,
    'tierlist_loaded': (r) => r.body.includes('tier') || r.body.includes('Tier'),
  });
  
  successRate.add(tierListSuccess);
  if (!tierListSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 2 + 1);
  
  let dictionnaireRes = http.get(`${BASE_URL}/dictionnaire`);
  const dictionnaireSuccess = check(dictionnaireRes, {
    'dictionnaire_status_200': (r) => r.status === 200,
    'dictionnaire_loaded': (r) => r.body.includes('dictionnaire') || r.body.includes('Dictionnaire'),
  });
  
  successRate.add(dictionnaireSuccess);
  if (!dictionnaireSuccess) failedRequests.add(1);
  
  sleep(Math.random() * 5 + 2);
} 