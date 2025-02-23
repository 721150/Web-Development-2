import { createRouter, createWebHistory } from 'vue-router'
import LegalInfoView from '../views/LegalInfoView.vue'
import BlogView from "@/views/BlogView.vue";
import ContactView from "@/views/ContactView.vue";
import NewPost from "@/views/NewPost.vue";
import LoginPage from "@/views/LoginPage.vue";
import AccountView from "@/views/AccountView.vue";
import DossierView from "@/views/DossierView.vue";

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
    {
      path: '/new-post',
      name: 'new-post',
      component: NewPost,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/dossier',
      name: 'dossier',
      component: DossierView,
    },
  ],
})

export default router
