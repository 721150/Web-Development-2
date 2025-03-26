import { createRouter, createWebHistory } from 'vue-router'
import LegalInfoView from '../views/LegalInfoView.vue'
import BlogView from "@/views/BlogView.vue";
import ContactView from "@/views/ContactView.vue";
import NewBlogView from "@/views/NewBlogView.vue";
import LoginPage from "@/views/LoginPage.vue";
import AccountView from "@/views/AccountView.vue";
import DossierView from "@/views/DossierView.vue";
import CreateAccountView from "@/views/CreateAccountView.vue";
import ManageAccountsView from "@/views/ManageAccountsView.vue";
import EditAccountView from "@/views/EditAccountView.vue";
import CaseListView from "@/views/CaseListView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        next('/legalInfo');
      },
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
      component: NewBlogView,
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
      path: '/dossier/:id',
      name: 'dossier',
      component: DossierView,
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: CreateAccountView,
    },
    {
      path: '/manage-accounts',
      name: 'manage-accounts',
      component: ManageAccountsView,
    },
    {
      path: '/edit-account/:id',
      name: 'edit-account',
      component: EditAccountView,
    },
    {
      path: '/caselist',
      name: 'caselist',
      component: CaseListView,
    }
  ],
})

export default router
