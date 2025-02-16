<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div>
    <header class="p-3 mb-4 border-bottom">
      <div class="container d-flex flex-wrap justify-content-center">
        <img alt="Vue logo" class="logo" src="@/assets/logo.jpeg" width="125" height="125" />
        <h1>Studentenhulp</h1>
        <nav class="nav nav-pills">
          <RouterLink to="/legalInfo" class="nav-link" active-class="active">Informatie</RouterLink>
          <RouterLink to="/blogs" class="nav-link" active-class="active">Blogs</RouterLink>
          <RouterLink to="/contact" class="nav-link" active-class="active">Contact</RouterLink>
        </nav>
      </div>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.logo {
  margin-right: 20px;
}

.nav-link.active {
  background-color: #007bff;
  color: white;
}
</style>
