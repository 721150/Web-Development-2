<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import ErrorModal from "@/components/ErrorModal.vue";
import NavigationButton from "@/components/NavigationButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const errorMessage = ref('');
const showErrorModal = ref(false);

const users = ref([]);

async function fetchData() {
  try {
    const response = await axios.get('/users');
    users.value = response.data;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
}

async function deleteUser(userId) {
  try {
    await axios.delete('/users/' + userId);
    fetchData();
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
}

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  fetchData();
});

function closeErrorModal() {
  showErrorModal.value = false;
}

function editUser(userId) {
  router.push({ name: 'edit-account', params: { id: userId } });
}
</script>

<template>
  <div class="container mt-5">
    <h2>Gebruikers Beheer</h2>
    <div class="mb-3">
      <NavigationButton buttonText="Nieuwe Gebruiker Aanmaken" buttonLink="/create-account" />
    </div>

    <div class="mb-3">
      <h3>Gebruikerslijst</h3>
      <table class="table">
        <thead>
        <tr>
          <th><strong>Voornaam</strong></th>
          <th><strong>Achternaam</strong></th>
          <th><strong>E-mailadres</strong></th>
          <th><strong>Instelling</strong></th>
          <th><strong>Acties</strong></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.institution.name }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editUser(user.id)">Bewerken</button>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Verwijderen</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
  </div>
</template>

<style scoped>

</style>
