import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const API_URL = 'https://'; 

const apiCallsDuration = new Trend('api_call_duration');
const failedRequests = new Counter('failed_requests');
const successRate = new Rate('success_rate');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Montée progressive à 10 utilisateurs
    { duration: '1m', target: 50 },    // Montée à 50 utilisateurs
    { duration: '3m', target: 100 },   // Test de charge avec 100 utilisateurs
    { duration: '1m', target: 200 },   // Test de pointe avec 200 utilisateurs
    { duration: '1m', target: 0 },     // Diminution progressive
  ],
  thresholds: {
    'api_call_duration': ['p(95)<3000'],  // 95% des requêtes doivent être sous 3s
    'failed_requests': ['count<100'],      // Moins de 100 échecs
    'success_rate': ['rate>0.95'],         // Taux de succès > 95%
    'http_req_duration': ['p(95)<3000'],   // 95% des requêtes http sous 3s
  },
};

export default function() {
  const headers = {
    'Content-Type': 'application/json',
  };

  group('Analytics API Tests', function() {
    const getAnalyticsResponse = http.get(`${API_URL}/api/analytics`, { headers });
    
    check(getAnalyticsResponse, {
      'GET analytics status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(getAnalyticsResponse.timings.duration);
    successRate.add(getAnalyticsResponse.status === 200);
    if (getAnalyticsResponse.status !== 200) failedRequests.add(1);
    
    const analyticsPayload = JSON.stringify({ 
      page: 'homepage',
      event: 'visit',
      timestamp: new Date().toISOString()
    });
    
    const postAnalyticsResponse = http.post(
      `${API_URL}/api/analytics`,
      analyticsPayload,
      { headers }
    );
    
    check(postAnalyticsResponse, {
      'POST analytics status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(postAnalyticsResponse.timings.duration);
    successRate.add(postAnalyticsResponse.status === 200);
    if (postAnalyticsResponse.status !== 200) failedRequests.add(1);
  });
  
  group('Build API Tests', function() {
    const getBuildsResponse = http.get(`${API_URL}/api/builds`, { headers });
    
    check(getBuildsResponse, {
      'GET builds status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(getBuildsResponse.timings.duration);
    successRate.add(getBuildsResponse.status === 200);
    if (getBuildsResponse.status !== 200) failedRequests.add(1);
    
    const testBuildName = `test-build-${__VU}-${Date.now()}`;
    
    const buildPayload = JSON.stringify({ 
      name: testBuildName,
      content: { 
        champion: 'Ahri',
        items: ['Item1', 'Item2'],
        runes: ['Rune1', 'Rune2']
      }
    });
    
    const postBuildResponse = http.post(
      `${API_URL}/api/save/${testBuildName}`,
      buildPayload,
      { headers }
    );
    
    check(postBuildResponse, {
      'POST build save status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(postBuildResponse.timings.duration);
    successRate.add(postBuildResponse.status === 200);
    if (postBuildResponse.status !== 200) failedRequests.add(1);
    
    if (postBuildResponse.status === 200) {
      const getBuildResponse = http.get(`${API_URL}/api/build/${testBuildName}`, { headers });
      
      check(getBuildResponse, {
        'GET specific build status 200': (r) => r.status === 200,
      });
      
      apiCallsDuration.add(getBuildResponse.timings.duration);
      successRate.add(getBuildResponse.status === 200);
      if (getBuildResponse.status !== 200) failedRequests.add(1);
    }
  });
  
  group('Dictionnaire API Tests', function() {

    const getDictionnaireResponse = http.get(`${API_URL}/api/dictionnaire`, { headers });
    
    check(getDictionnaireResponse, {
      'GET dictionnaire status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(getDictionnaireResponse.timings.duration);
    successRate.add(getDictionnaireResponse.status === 200);
    if (getDictionnaireResponse.status !== 200) failedRequests.add(1);
  });
  
  group('Contact API Tests', function() {

    const getContactResponse = http.get(`${API_URL}/api/contact`, { headers });
    
    check(getContactResponse, {
      'GET contacts status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(getContactResponse.timings.duration);
    successRate.add(getContactResponse.status === 200);
    if (getContactResponse.status !== 200) failedRequests.add(1);
    
    const contactPayload = JSON.stringify({ 
      name: `Test User ${__VU}`,
      email: `test${__VU}@example.com`,
      subject: 'Test Subject',
      message: 'This is a test message for load testing'
    });
    
    const postContactResponse = http.post(
      `${API_URL}/api/contact`,
      contactPayload,
      { headers }
    );
    
    check(postContactResponse, {
      'POST contact status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(postContactResponse.timings.duration);
    successRate.add(postContactResponse.status === 200);
    if (postContactResponse.status !== 200) failedRequests.add(1);
  });
  
  group('TierList API Tests', function() {

    const getTierlistResponse = http.get(`${API_URL}/api/tierlist/all`, { headers });
    
    check(getTierlistResponse, {
      'GET tierlist status 200': (r) => r.status === 200,
    });
    
    apiCallsDuration.add(getTierlistResponse.timings.duration);
    successRate.add(getTierlistResponse.status === 200);
    if (getTierlistResponse.status !== 200) failedRequests.add(1);
  });
  
  sleep(1);
} 