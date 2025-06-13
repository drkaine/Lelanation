<template>
  <div class="seo-audit">
    <h1>Audit SEO</h1>

    <div class="audit-section">
      <h2>Test des Redirections</h2>
      <button @click="testRedirects" :disabled="testing">
        {{ testing ? 'Test en cours...' : 'Tester les redirections' }}
      </button>

      <div v-if="redirectResults.length" class="results">
        <h3>Résultats:</h3>
        <ul>
          <li v-for="result in redirectResults" :key="result.url">
            <strong>{{ result.url }}</strong
            >: {{ result.redirects }} redirection(s)
            <span v-if="result.redirects > 2" class="warning">
              ⚠️ Trop de redirections</span
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="audit-section">
      <h2>Validation Sitemap</h2>
      <button @click="validateSitemap" :disabled="testing">
        {{ testing ? 'Validation en cours...' : 'Valider le sitemap' }}
      </button>

      <div v-if="sitemapIssues.length" class="results">
        <h3>Problèmes détectés:</h3>
        <ul>
          <li
            v-for="issue in sitemapIssues"
            :key="issue.message"
            :class="issue.type"
          >
            {{ issue.message }}
            <em v-if="issue.fix">{{ issue.fix }}</em>
          </li>
        </ul>
      </div>
    </div>

    <div class="audit-section">
      <h2>URLs Canoniques</h2>
      <div class="current-canonical">
        <strong>URL actuelle:</strong> {{ currentUrl }}<br />
        <strong>Canonical optimal:</strong> {{ optimalCanonical }}
        <span v-if="currentUrl !== optimalCanonical" class="warning">
          ⚠️ Non optimal</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SEOAuditor } from '@/utils/seoAudit'
import { SEOCanonicalValidator } from '@/utils/seoValidation'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Audit SEO - Outils de développement',
  description: "Outils d'audit SEO pour développeurs",
  noIndex: true,
})

const testing = ref(false)
const redirectResults = ref<Array<{ url: string; redirects: number }>>([])
const sitemapIssues = ref<
  Array<{ type: string; message: string; fix?: string }>
>([])

const currentUrl = ref('')
const optimalCanonical = computed(() =>
  currentUrl.value
    ? SEOCanonicalValidator.buildCanonicalUrl(
        new URL(currentUrl.value).pathname,
      )
    : '',
)

onMounted(() => {
  currentUrl.value = window.location.href
})

async function testRedirects() {
  testing.value = true
  redirectResults.value = []

  try {
    const testUrls = [
      'https://lelanation.fr',
      'https://www.lelanation.fr',
      'http://lelanation.fr',
      'http://www.lelanation.fr',
    ]

    for (const url of testUrls) {
      const validation = SEOCanonicalValidator.validateUrl(url)
      const redirectCount = validation.redirectNeeded ? 1 : 0
      redirectResults.value.push({ url, redirects: redirectCount })
    }
  } catch (error) {
    console.error('Erreur lors du test des redirections:', error)
  } finally {
    testing.value = false
  }
}

async function validateSitemap() {
  testing.value = true
  sitemapIssues.value = []

  try {
    const result = await SEOAuditor.validateProductionSitemap()
    sitemapIssues.value = result.issues.map(issue => ({
      type: 'error',
      message: issue,
    }))
  } catch (error) {
    console.error('Erreur lors de la validation du sitemap:', error)
    sitemapIssues.value = [
      {
        type: 'error',
        message: `Erreur lors de la validation: ${error instanceof Error ? error.message : String(error)}`,
      },
    ]
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.seo-audit {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.audit-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.results {
  margin-top: 1rem;
}

.warning {
  color: #ff6b35;
  font-weight: bold;
}

.error {
  color: #d32f2f;
}

button {
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.current-canonical {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
