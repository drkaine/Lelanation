<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Page non trouvée</h1>
      <p class="error-description">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <div class="suggested-actions">
        <router-link to="/" class="btn-primary">
          Retour à l'accueil
        </router-link>

        <div class="popular-links">
          <h2>Pages populaires :</h2>
          <ul>
            <li><router-link to="/build">Créateur de builds</router-link></li>
            <li>
              <router-link to="/builds-publics"
                >Builds de la communauté</router-link
              >
            </li>
            <li>
              <router-link to="/lelariva-builds"
                >Builds de Lelariva</router-link
              >
            </li>
            <li><router-link to="/videos">Vidéos</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { setHttpStatus, checkCurrentRoute } from '@/utils/routeValidator'

useHead({
  title: '404 - Page non trouvée | Lelanation',
  meta: [
    {
      name: 'description',
      content:
        "La page demandée n'existe pas. Découvrez nos builds League of Legends, guides et outils sur Lelanation.",
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'http-status',
      content: '404',
    },
  ],
})

onMounted(() => {
  setHttpStatus(404)

  const routeInfo = checkCurrentRoute()

  if (import.meta.env.DEV) {
    console.warn(`404 page loaded for: ${routeInfo.path}`)
  }

  const windowWithGtag = window as typeof window & {
    gtag?: (...args: unknown[]) => void
  }
  if (typeof windowWithGtag.gtag !== 'undefined') {
    windowWithGtag.gtag('event', 'page_view', {
      page_title: '404 - Page non trouvée',
      page_location: window.location.href,
      page_path: window.location.pathname,
      custom_map: {
        metric1: 404,
      },
    })
  }
})
</script>

<style scoped>
.not-found-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.not-found-content {
  max-width: 600px;
  width: 100%;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #c89b3c;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  line-height: 1;
}

.error-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #f0e6d2;
}

.error-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #a09b8c;
  line-height: 1.6;
}

.suggested-actions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #c89b3c, #f0e6d2);
  color: #0f2027;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(200, 155, 60, 0.3);
  border-color: #c89b3c;
}

.popular-links {
  text-align: left;
}

.popular-links h2 {
  color: #f0e6d2;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.popular-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popular-links li {
  margin-bottom: 0.5rem;
}

.popular-links a {
  color: #c89b3c;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.popular-links a:hover {
  color: #f0e6d2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .popular-links {
    text-align: center;
  }
}
</style>
