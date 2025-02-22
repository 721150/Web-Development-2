import { createRouter, createWebHistory } from 'vue-router'
import LegalInfoView from '../views/LegalInfoView.vue'
import BlogView from "@/views/BlogView.vue";
import ContactView from "@/views/ContactView.vue";

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
    {
      path: '/blogs',
      name: 'blogs',
      component: BlogView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
  ],
})

export default router
