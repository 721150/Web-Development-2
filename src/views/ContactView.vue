<script setup>
import {onMounted, ref} from 'vue';
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
const files = ref([]);

function handleFileUpload(event) {
  const newFile = event.target.files[0];
  files.value = [newFile];
}

async function submitForm() {
  if (!subject.value || !typeOfLaw.value || !content.value) {
    errorMessage.value = "Fout: Alle velden moeten worden ingevuld.";
    showErrorModal.value = true;
    return;
  }

  try {
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

    if (files.value.length > 0) {
      const fileBase64 = await fileToBase64(files.value[0]);
      caseData.document = fileBase64;
    }

    const response = await axios.post('/cases', caseData);

    newCase.value = response;
    showSuccessModal.value = true;

  } catch (error) {
    errorMessage.value = `Fout: ${error.message}`;
    showErrorModal.value = true;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function closeErrorModal() {
  showErrorModal.value = false;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
  router.push('/account');
}

onMounted(async () => {
  if (!authStore.isLoggedIn) {
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
    <div class="mb-3">
      <label for="file" class="form-label">Documenten</label>
      <input type="file" class="form-control" id="files" multiple @change="handleFileUpload">
    </div>
    <div class="mb-3">
      <h5>Geselecteerd bestand:</h5>
      <ul>
        <li v-for="file in files" :key="file.name">{{ file.name }}</li>
      </ul>
    </div>
    <button class="btn btn-success" @click="submitForm">Verstuur</button>
  </div>

  <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
  <CasusModal :showModal="showSuccessModal" :caseData="newCase" @close="closeSuccessModal" />
</template>

<style scoped>

</style>
