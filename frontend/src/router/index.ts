import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { BuildProps } from '@/types/build'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/build',
    name: 'build-tool',
    component: () => import('../views/BuildToolView.vue'),
  },
  {
    path: '/build/edit',
    name: 'build-edit',
    component: () => import('../views/BuildToolView.vue'),
    props: route =>
      ({
        editMode: true,
        fileName: route.query.file as string | undefined,
      }) satisfies BuildProps,
  },
  {
    path: '/builds',
    name: 'Mes build',
    component: () => import('../views/MesBuildsView.vue'),
  },
  {
    path: '/builds-publics',
    name: 'Builds de la communauté',
    component: () => import('../views/CommuBuildsView.vue'),
  },
  {
    path: '/:name',
    name: 'connexion',
    component: () => import('../views/ConnexionBuildView.vue'),
    props: true,
  },
  {
    path: '/Lebuildarriva',
    name: 'Lebuildarriva',
    component: () => import('../views/MesBuildsView.vue'),
  },
  {
    path: '/dictionnaire/proposition',
    name: 'Proposition de définition',
    component: () => import('../views/DictionnairePropositionView.vue'),
  },
  {
    path: '/dictionnaire',
    name: 'dictionnaire',
    component: () => import('../views/DictionnaireView.vue'),
  },
  {
    path: '/statistique',
    name: 'statistique',
    component: () => import('../views/StatistiqueView.vue'),
  },
  {
    path: '/admin/:name',
    name: 'admin-statistique',
    component: () => import('../views/AdminView.vue'),
    props: true,
  },
  {
    path: '/legal',
    name: 'legal',
    component: () => import('../views/LegalView.vue'),
  },
  {
    path: '/build/:type/:fileName',
    name: 'build-recap-typed',
    component: () => import('../views/BuildRecapView.vue'),
    props: true,
  },
  {
    path: '/build/edit',
    name: 'build-edit',
    component: () => import('../views/BuildToolView.vue'),
    props: route =>
      ({
        editMode: true,
        fileName: route.query.file as string | undefined,
      }) satisfies BuildProps,
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('../views/ShortView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  let title = 'Lelanation - Builds League of Legends'
  let description =
    'Créez et partagez vos builds League of Legends. Guides détaillés et statistiques.'

  switch (to.name) {
    case 'build-tool':
      title = 'Créer un Build LoL - Lelanation'
      description =
        'Créez votre build personnalisé pour League of Legends avec notre outil intuitif.'
      break
    case 'dictionnaire':
      title = 'Dictionnaire Lelariva - Lelanation'
      description =
        'Le dictionnaire officiel de la communauté Lelariva. Découvrez le vocabulaire unique de LoL.'
      break
    case 'statistique':
      title = 'Statistiques LoL - Lelanation'
      description =
        'Analysez les statistiques des champions et des builds League of Legends.'
      break
  }

  document.title = title
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', description)
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute('content', title)
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute('content', description)

  next()
})

export default router
