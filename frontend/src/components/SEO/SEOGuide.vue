<template>
  <div class="seo-guide">
    <h1>Guide SEO - Lelanation</h1>

    <section class="seo-section">
      <h2>🎯 Problèmes SEO Résolus</h2>
      <div class="seo-problems">
        <div class="problem-solved">
          <h3>✅ Titles en doublon</h3>
          <p>
            Chaque page a maintenant un titre unique avec des suffixes basés sur
            les routes
          </p>
          <pre><code>
"Lelanation - Builds et Guides... | Communauté LoL"
"Créateur de Build LoL - Créateur | Lelanation"
"Builds Communautaires LoL - Communauté | Lelanation"</code></pre>
        </div>

        <div class="problem-solved">
          <h3>✅ Meta descriptions manquantes</h3>
          <p>
            Toutes les pages ont des descriptions uniques et optimisées (120-160
            caractères)
          </p>
          <ul>
            <li>Validation automatique en développement</li>
            <li>Descriptions spécifiques par page</li>
            <li>Mots-clés pertinents inclus</li>
          </ul>
        </div>

        <div class="problem-solved">
          <h3>✅ Contenu dupliqué</h3>
          <p>Système de redirections canoniques automatiques</p>
          <ul>
            <li>/build/ → /build</li>
            <li>/builds-publics/ → /builds-publics</li>
            <li>/index.html → /</li>
          </ul>
        </div>

        <div class="problem-solved">
          <h3>✅ Title trop court</h3>
          <p>
            Tous les titres respectent les bonnes pratiques (30-60 caractères)
          </p>
        </div>
      </div>
    </section>

    <section class="seo-section">
      <h2>🛠️ Architecture SEO Mise en Place</h2>

      <div class="architecture-item">
        <h3>useSEOHead Composable</h3>
        <p>Système centralisé pour gérer toutes les métadonnées SEO</p>
        <pre><code>useSEOHead({
  title: 'Titre unique et descriptif',
  description: 'Description optimisée 120-160 caractères',
  keywords: 'mots-clés, pertinents',
  type: 'website|article',
  structuredData: { /* JSON-LD */ }
})</code></pre>
      </div>

      <div class="architecture-item">
        <h3>CanonicalManager</h3>
        <p>Gestion automatique des URLs canoniques et redirections</p>
        <ul>
          <li>Normalisation des URLs</li>
          <li>Redirections 301 automatiques</li>
          <li>Évite le contenu dupliqué</li>
        </ul>
      </div>

      <div class="architecture-item">
        <h3>Structured Data</h3>
        <p>
          Données structurées JSON-LD riches pour améliorer les rich snippets
        </p>
        <ul>
          <li>Organization markup</li>
          <li>WebSite avec search action</li>
          <li>WebApplication pour l'outil de build</li>
          <li>BreadcrumbList pour la navigation</li>
        </ul>
      </div>
    </section>

    <section class="seo-section">
      <h2>📊 Métriques et Validation</h2>

      <div class="validation-tools">
        <h3>Validation Automatique</h3>
        <ul>
          <li>Vérification des longueurs de titres et descriptions</li>
          <li>Détection des doublons</li>
          <li>Validation des liens canoniques</li>
          <li>Warnings dans la console en développement</li>
        </ul>
      </div>

      <div class="seo-checklist">
        <h3>Checklist SEO ✅</h3>
        <ul>
          <li>✅ Titre unique par page (30-60 caractères)</li>
          <li>✅ Meta description par page (120-160 caractères)</li>
          <li>✅ Liens canoniques partout</li>
          <li>✅ Structured data JSON-LD</li>
          <li>✅ Sitemap.xml à jour</li>
          <li>✅ Robots.txt optimisé</li>
          <li>✅ Open Graph tags</li>
          <li>✅ Twitter Card tags</li>
          <li>✅ Images optimisées avec alt text</li>
          <li>✅ URLs propres et descriptives</li>
        </ul>
      </div>
    </section>

    <section class="seo-section">
      <h2>🚀 Prochaines Étapes</h2>

      <div class="next-steps">
        <h3>Améliorations Recommandées</h3>
        <ul>
          <li>
            🔄 Automatiser la génération du sitemap avec les builds dynamiques
          </li>
          <li>📊 Ajouter des métriques Core Web Vitals</li>
          <li>🖼️ Optimiser les images avec lazy loading</li>
          <li>🔗 Implémenter un système de breadcrumbs visuels</li>
          <li>📱 Améliorer le SEO mobile-first</li>
          <li>🌍 Ajouter support hreflang pour l'international</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.seo-guide {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.seo-guide h1 {
  color: #c8941a;
  text-align: center;
  margin-bottom: 2rem;
}

.seo-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.seo-section h2 {
  color: #2c3e50;
  border-bottom: 2px solid #c8941a;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.problem-solved {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #e8f5e8;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
}

.problem-solved h3 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

.architecture-item {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
}

.architecture-item h3 {
  color: #1565c0;
  margin-bottom: 0.5rem;
}

pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
}

.validation-tools,
.seo-checklist,
.next-steps {
  background: #fff;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.25rem;
}

.seo-checklist ul li {
  color: #2e7d32;
  font-weight: 500;
}

.next-steps ul li {
  color: #f57c00;
}
</style>
