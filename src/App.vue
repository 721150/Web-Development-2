<script setup>
import {RouterLink, RouterView, useRouter} from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <div>
    <header class="p-3 mb-4 border-bottom">
      <div class="container d-flex flex-wrap align-items-center justify-content-center">
        <img alt="Vue logo" class="me-3" src="@/assets/logo.jpeg" width="125" height="125" />
        <h1 class="ms-3">Studentenhulp</h1>
      </div>
      <nav class="nav nav-pills container d-flex flex-wrap justify-content-center mt-3">
        <RouterLink to="/legalInfo" class="nav-link" active-class="active">Informatie</RouterLink>
        <RouterLink to="/blogs" class="nav-link" active-class="active">Blogs</RouterLink>
        <RouterLink to="/contact" class="nav-link" active-class="active">Contact</RouterLink>
        <RouterLink to="/account" class="nav-link" active-class="active">Account</RouterLink>
        <button v-if="authStore.isLoggedIn" @click="handleLogout" class="nav-link btn btn-link">Uitloggen</button>
        <RouterLink v-else to="/login" class="nav-link" active-class="active">Inloggen</RouterLink>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.nav-link.active {
  background-color: #28a745;
  color: white;
}
</style>
