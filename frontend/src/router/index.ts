import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/build',
      name: 'Outil de Build',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BuildToolView.vue'),
    },
    {
      path: '/champions',
      name: 'Champion',
      component: () => import('../views/ChampionView.vue'),
    },
    {
      path: '/runes',
      name: 'Runes',
      component: () => import('../views/RunesView.vue'),
    },
    {
      path: '/items',
      name: 'Items',
      component: () => import('../views/ItemsView.vue'),
    },
    {
      path: '/build/:fileName',
      name: 'build',
      component: () => import('../views/BuildRecapView.vue'),
      props: true,
    },
    {
      path: '/build/edit',
      name: 'buildEdit',
      component: () => import('../views/BuildToolView.vue'),
      props: route => ({ editMode: true, fileName: route.query.file }),
    },
  ],
})

export default router
