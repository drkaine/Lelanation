import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

interface BuildProps {
  editMode: boolean
  fileName?: string
}

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
  // {
  //   path: '/champions',
  //   name: 'champions',
  //   component: () => import('../views/ChampionView.vue'),
  // },
  // {
  //   path: '/runes',
  //   name: 'runes',
  //   component: () => import('../views/RunesView.vue'),
  // },
  // {
  //   path: '/items',
  //   name: 'items',
  //   component: () => import('../views/ItemsView.vue'),
  // },
  {
    path: '/build/:fileName',
    name: 'build',
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
