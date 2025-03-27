<script setup>
import { onMounted, ref } from 'vue';
import SelectField from '../components/SelectField.vue';
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import axios from "@/axios-auth.js";
import ErrorModal from "@/components/ErrorModal.vue";
import CasusModal from "@/components/CasusModal.vue";
import { useDataStore } from "@/stores/data.js";

const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const errorMessage = ref("");
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const newCase = ref('');

const content = ref('');
const subject = ref('');
const typeOfLaw = ref('');
const file = ref([]);

function handleFileUpload(event) {
  const newFile = event.target.files[0];
  if (newFile.size > 1048576) {
    errorMessage.value = "Bestand is te groot, mag niet groter zijn dan 1 MB";
    showErrorModal.value = true;
    return;
  }
  file.value = [newFile];
}

function getData() {
  const selectedSubject = dataStore.subjects.find(item => item.id === parseInt(subject.value));
  const selectedTypeOfLaw = dataStore.typeOfLaws.find(item => item.id === parseInt(typeOfLaw.value));

  const caseData = {
    user: authStore.userId,
    subject: {
      id: subject.value,
      description: selectedSubject.description,
    },
    typeOfLaw: {
      id: typeOfLaw.value,
      description: selectedTypeOfLaw.description,
    },
    content: content.value,
  };

  if (file.value.length > 0) {
    caseData.document = file.value[0];
  }
  return caseData;
}

async function submitForm() {
  if (!subject.value || !typeOfLaw.value || !content.value) {
    errorMessage.value = "Fout: Alle velden moeten worden ingevuld.";
    showErrorModal.value = true;
    return;
  }

  try {
    const caseData = getData();

    const response = await axios.post('/cases', caseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    newCase.value = response;
    showSuccessModal.value = true;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
}

function closeErrorModal() {
  showErrorModal.value = false;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
  router.push('/account');
}

onMounted(async () => {
  if (!authStore.isLoggedIn || authStore.userRole !== "Indiener") {
    router.push('/login');
    return;
  }

  await dataStore.fetchData();
  if (dataStore.error) {
    if (dataStore.error.response) {
      errorMessage.value = `Fout: ${dataStore.error.response.status} - ${dataStore.error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
});
</script>

<template>
  <div class="container mt-5">
    <h2>Leg een casus voor over je rechten</h2>
    <SelectField label="Onderwerp" v-model="subject" :options="dataStore.subjects" />
    <SelectField label="Soort recht" v-model="typeOfLaw" :options="dataStore.typeOfLaws" />
    <div class="mb-3">
      <label for="question" class="form-label">Casus</label>
      <textarea v-model="content" class="form-control" id="question" rows="3" placeholder="Beschrijf je casus"></textarea>
    </div>
    <div class="mb-5">
      <label for="file" class="form-label">Document</label>
      <input type="file" class="form-control" id="files" @change="handleFileUpload">
    </div>
    <button class="btn btn-success" @click="submitForm">Verstuur</button>
  </div>

  <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
  <CasusModal :showModal="showSuccessModal" :caseData="newCase" @close="closeSuccessModal" />
</template>

<style scoped>

</style>
