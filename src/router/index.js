import { createRouter, createWebHistory } from 'vue-router'
import LegalInfoView from '../views/LegalInfoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LegalInfoView,
    },
    {
      path: '/legalInfo',
      name: 'legalInfo',
      component: LegalInfoView,
    },
  ],
})

export default router
