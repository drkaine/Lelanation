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
      path: '/infos/champions',
      name: 'Champion',
      component: () => import('../views/ChampionView.vue'),
    },
    {
      path: '/infos/runes',
      name: 'Runes',
      component: () => import('../views/RunesView.vue'),
    },
    // {
    //   path: '/infos/items',
    //   name: 'Items',
    //   component: () => import('../views/infosToolView.vue'),
    // },
    // {
    //   path: '/infos/info',
    //   name: 'Infos',
    //   component: () => import('../views/infosToolView.vue'),
    // },
  ],
  
})

export default router
