<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import QuestionList from '../components/QuestionList.vue';
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import ErrorModal from "@/components/ErrorModal.vue";

const router = useRouter();
const authStore = useAuthStore();

const openQuestions = ref([]);
const inProgressQuestions = ref([]);
const closedQuestions = ref([]);
const errorMessage = ref('');
const showErrorModal = ref(false);

async function fetchQuestions() {
  try {
    const response = await axios.get('/cases');
    const questions = response.data;

    openQuestions.value = questions.filter(q => q.status === 'Open');
    inProgressQuestions.value = questions.filter(q => q.status === 'In behandeling');
    closedQuestions.value = questions.filter(q => q.status === 'Gesloten');
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
  if (!authStore.isLoggedIn || authStore.userRole !== 'Behandelaar') {
    router.push('/login');
    return;
  }

  await fetchQuestions();
});

function viewDossier(dossierId) {
  router.push({ name: 'dossier', params: { id: dossierId } });
}

function closeErrorModal() {
  showErrorModal.value = false;
}
</script>

<template>
  <div class="container mt-5">
    <QuestionList v-if="openQuestions.length > 0" title="Open Vragen" :questions="openQuestions" :viewDossier="viewDossier" />
    <QuestionList v-if="inProgressQuestions.length > 0" title="In Behandeling" :questions="inProgressQuestions" :viewDossier="viewDossier" />
    <QuestionList v-if="closedQuestions.length > 0" title="Gesloten Vragen" :questions="closedQuestions" :viewDossier="viewDossier" />
    <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
  </div>
</template>

<style scoped>

</style>
