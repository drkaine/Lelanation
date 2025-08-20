import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const API_URL = 'https://www.'; 

const cacheMissRate = new Rate('cache_miss_rate');
const responseTime = new Trend('response_time');
const responseSize = new Trend('response_size');
const requests = new Counter('requests');

export const options = {
  stages: [
    { duration: '30s', target: 20 },  
    { duration: '2m', target: 50 },   
    { duration: '30s', target: 0 },  
  ],
  thresholds: {
    'response_time': ['p(95)<500'],  // 95% des réponses sous 500ms
    'cache_miss_rate': ['rate<0.3'], // Moins de 30% de cache miss
  },
};

const routes = [
  '/api/builds',
  '/api/dictionnaire',
  '/api/tierlist/all',
  '/api/analytics'
];

const popularBuilds = [
  'popular-build-1',
  'popular-build-2',
  'popular-build-3',
  'popular-build-4',
  'popular-build-5'
];

export default function() {
  const routeIndex = Math.floor(Math.random() * routes.length);
  const route = routes[routeIndex];
  
  const start = new Date();
  const response = http.get(`${API_URL}${route}`);
  const duration = new Date() - start;
  
  responseTime.add(duration);
  responseSize.add(response.body.length);
  requests.add(1);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  
  const isCacheHit = response.headers['X-Cache'] === 'HIT';
  cacheMissRate.add(!isCacheHit);
  
  if (Math.random() < 0.5) { 
    const buildIndex = Math.floor(Math.random() * popularBuilds.length);
    const buildName = popularBuilds[buildIndex];
    
    const buildStart = new Date();
    const buildResponse = http.get(`${API_URL}/api/build/${buildName}`);
    const buildDuration = new Date() - buildStart;
    
    responseTime.add(buildDuration);
    responseSize.add(buildResponse.body.length);
    requests.add(1);
    
    check(buildResponse, {
      'build status is 200': (r) => r.status === 200,
    });
    
    const buildCacheHit = buildResponse.headers['X-Cache'] === 'HIT';
    cacheMissRate.add(!buildCacheHit);
  }
  
  sleep(1);
} 