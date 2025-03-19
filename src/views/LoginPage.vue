<script setup>
import { onMounted, ref} from 'vue';
import { useAuthStore } from '@/stores/auth';
import InputField from "@/components/InputField.vue";
import {useRouter} from "vue-router";

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

async function login() {
  try {
    await authStore.login(email.value, password.value);
    router.push('/account');
  } catch (error) {
    errorMessage.value = `Fout: ${authStore.error || error.message}`;
  }
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/account');
  }
})
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
