<script setup>
import { onMounted, ref } from 'vue';
import GeneralInfo from "../components/GeneralInfo.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import axios from "@/axios-auth.js";
import ErrorModal from "@/components/ErrorModal.vue";
import CasusModal from "@/components/CasusModal.vue";
import SuccessModal from "@/components/SuccessModal.vue";

const authStore = useAuthStore();
const router = useRouter();

const request = ref([]);
const newCase = ref(null);
const newCommunication = ref(null);

const errorMessage = ref('');
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const showConfirmModal = ref(false);
const message = ref("");

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
    request.value.userId = data.user.id;
    request.value.institutionId = data.institution.id;
    request.value.institution = data.institution.name;
    request.value.courseId = data.education.id;
    request.value.course = data.education.name;
    request.value.subjectId = data.subject.id;
    request.value.subject = data.subject.description;
    request.value.typeId = data.typeOfLaw.id;
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

async function updateStatus() {
  try {
    const dossierId = router.currentRoute.value.params.id;
    const updatedCase = {
      id: dossierId,
      user: request.value.userId,
      institution: {
        id: request.value.institutionId,
        name: request.value.institution
      },
      education: {
        id: request.value.courseId,
        name: request.value.course
      },
      subject: {
        id: request.value.subjectId,
        description: request.value.subject
      },
      typeOfLaw: {
        id: request.value.typeId,
        description: request.value.type
      },
      content: request.value.question,
      documents: request.value.documents,
      status: request.value.status,
    };

    const response = await axios.put(`/cases/${dossierId}`, updatedCase, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    message.value = "Status aangepast: " + response.data.status;
    showConfirmModal.value = true;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het bijwerken van de status.';
    }
    showErrorModal.value = true;
  }
}

async function sendResponse() {
  try {
    const dossierId = router.currentRoute.value.params.id;
    const makeCommunication = {
      handler: authStore.userId,
      content: newCommunication.value,
      caseId: dossierId
    };

    const response = await axios.post(`/communications`, makeCommunication);
    message.value = "Antwoord verzonden: " + response.data.content;
    showConfirmModal.value = true;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het bijwerken van de status.';
    }
    showErrorModal.value = true;
  }
}

function closeErrorModal() {
  showErrorModal.value = false;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}

function closeConfirmModal() {
  showConfirmModal.value = false;
}
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
    <div v-if="authStore.userRole === `Indiener`" class="card mb-5">
      <div class="card-body">
        <GeneralInfo title="Status" :text="request.status" />
      </div>
    </div>
    <div v-if="authStore.userRole === `Behandelaar`">
      <h1 v-if="!request.communicationHandler">Antwoord Schrijven</h1>
      <div v-if="!request.communicationHandler" class="card mb-3">
        <div class="card-body">
          <textarea v-model="newCommunication" class="form-control" rows="5"></textarea>
          <button @click="sendResponse" class="btn btn-success mt-3">Verstuur antwoord</button>
        </div>
      </div>
      <h1>Status Aanpassen</h1>
      <div class="card mb-5">
        <div class="card-body">
          <select v-model="request.status" class="form-select">
            <option value="Open">Open</option>
            <option value="In behandeling">In Behandeling</option>
            <option value="Gesloten">Gesloten</option>
          </select>
          <button @click="updateStatus" class="btn btn-success mt-3">Update Status</button>
        </div>
      </div>
    </div>
  </div>
  <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
  <CasusModal :showModal="showSuccessModal" :caseData="newCase" @close="closeSuccessModal" />
  <SuccessModal :showModal="showConfirmModal" :message="message" @close="closeConfirmModal" />
</template>

<style scoped>

</style>
