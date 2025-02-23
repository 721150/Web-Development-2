<script setup>
import InputField from "@/components/InputField.vue";
</script>

<template>
  <div class="container mt-5">
    <h2>Inloggen</h2>
    <InputField label="E-mailadres" v-model="email" type="email" placeholder="E-mailadres" />
    <div class="mb-3">
      <label for="password" class="form-label">Wachtwoord</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Wachtwoord">
    </div>
    <button class="btn btn-success" @click="login">Inloggen</button>
  </div>
</template>

<style scoped>

</style>
