<script setup>
import { ref } from 'vue';
import axios from '@/axios-auth.js';
import InputField from "@/components/InputField.vue";

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function login() {
  try {
    const response = await axios.post('/users', {
      email: email.value,
      password: password.value
    });
    console.log('Inloggen succesvol:', response.data);
    // Hier kun je de gebruiker doorverwijzen naar een andere pagina of de inlogstatus opslaan
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.data.message}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het inloggen.';
    }
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Inloggen</h2>
    <InputField v-model="email" label="E-mailadres" type="email" placeholder="E-mailadres" />
    <div class="mb-3">
      <label for="password" class="form-label">Wachtwoord</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Wachtwoord">
    </div>
    <button class="btn btn-success" @click="login">Inloggen</button>
    <div v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
</style>
