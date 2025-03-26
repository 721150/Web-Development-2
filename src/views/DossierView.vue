<script setup>
import { onMounted, ref } from 'vue';
import GeneralInfo from "../components/GeneralInfo.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import axios from "@/axios-auth.js";
import ErrorModal from "@/components/ErrorModal.vue";

const authStore = useAuthStore();
const router = useRouter();

const request = ref([]);

const errorMessage = ref('');
const showErrorModal = ref(false);

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  try {
    const dossierId = router.currentRoute.value.params.id;
    const response = await axios.get(`/cases/case/${dossierId}`);
    const data = response.data;

    request.value.submitter = `${data.user.firstname} ${data.user.lastname}`;
    request.value.institution = data.institution.name;
    request.value.course = data.education.name;
    request.value.subject = data.subject.description;
    request.value.type = data.typeOfLaw.description;
    request.value.question = data.content;
    request.value.documents = data.documents.map(doc => ({
      id: doc.id,
      name: 'Document ' + doc.id,
      url: 'http://localhost/' + doc.document
    }));
    request.value.status = data.status;

    const communicationResponse = await axios.get(`/communications/${dossierId}`);
    if (communicationResponse.data.handler) {
      request.value.communicationContent = communicationResponse.data.content;
      request.value.communicationId = communicationResponse.data.id;
      request.value.communicationHandler = `${communicationResponse.data.handler.firstname} ${communicationResponse.data.handler.lastname}`;
    }
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
});
</script>

<template>
  <div class="container mt-5">
    <h1>Verzoek gegevens</h1>
    <div class="card mb-3">
      <div class="card-body">
        <GeneralInfo title="Gegevens Indiener" :text="request.submitter" />
        <GeneralInfo title="Instelling" :text="request.institution" />
        <GeneralInfo title="Opleiding" :text="request.course" />
        <GeneralInfo title="Onderwerp" :text="request.subject" />
        <GeneralInfo title="Soort Recht" :text="request.type" />
        <GeneralInfo title="Casus" :text="request.question" />
        <h4 class="card-title fw-bold">Meegestuurd Document</h4>
        <ul class="list-group">
          <li class="list-group-item" v-for="document in request.documents" :key="document.id">
            <a :href="document.url" target="_blank" class="text-primary">{{ document.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <h1 v-if="request.communicationHandler">Reactie</h1>
    <div v-if="request.communicationHandler" class="card mb-3">
      <div class="card-body">
        <GeneralInfo title="Behandelaar" :text="request.communicationHandler" />
        <GeneralInfo title="Antwoord" :text="request.communicationContent" />
      </div>
    </div>
    <h1>Status Aanpassen</h1>
    <div class="card mb-5">
      <div class="card-body">
        <GeneralInfo title="Status" :text="request.status" />
      </div>
    </div>
  </div>
  <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
</template>

<style scoped>

</style>
