<script setup>
import { ref } from 'vue';
import axios from '@/axios-auth.js';
import InputField from "@/components/InputField.vue";

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function login() {
  try {
    const response = await axios.get('/users/login', {
      email: email.value,
      password: password.value
    });
    console.log('Inloggen succesvol:', response.data);
    // Hier kun je de gebruiker doorverwijzen naar een andere pagina of de inlogstatus opslaan
  } catch (error) {
    errorMessage.value = `Fout: ${error.response.data.errorMessage}`;
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Inloggen</h2>
    <InputField v-model="email" label="E-mailadres" type="email" placeholder="E-mailadres" />
    <InputField label="Wachtwoord" v-model="password" type="password" placeholder="Wachtwoord" />
    <button class="btn btn-success" @click="login">Inloggen</button>
    <div v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
</style>
