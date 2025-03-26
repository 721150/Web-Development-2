<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import InputField from '../components/InputField.vue';
import QuestionList from '../components/QuestionList.vue';
import SelectField from "@/components/SelectField.vue";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import ErrorModal from "@/components/ErrorModal.vue";
import UserModal from "@/components/UserModal.vue";
import { useDataStore } from "@/stores/data.js";

const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();

const id = ref('');
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const institution = ref('');
const phone = ref('');
const image = ref('');
const placeholderImage = 'src/assets/placeholder.jpg';

const openQuestions = ref([]);
const handledQuestions = ref([]);

const cases = ref([]);
const errorMessage = ref('');
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const createdUser = ref(null);

const isHandler = ref(false);
const isApplicant = ref(false);
const handlerTypeOfLaws = ref([]);
const handlerSubjects = ref([]);
const applicantEducation = ref('');
const userId = ref('');

async function fetchData() {
  try {
    const profileResponse = await axios.get('/users/' + id.value);

    firstname.value = profileResponse.data.firstname;
    lastname.value = profileResponse.data.lastname;
    email.value = profileResponse.data.email;
    institution.value = profileResponse.data.institution.id;
    phone.value = profileResponse.data.phone;
    image.value = profileResponse.data.image;

    if (profileResponse.data.typeOfLaws && profileResponse.data.subjects) {
      isHandler.value = true;
      handlerTypeOfLaws.value = profileResponse.data.typeOfLaws;
      handlerSubjects.value = profileResponse.data.subjects;
      userId.value = profileResponse.data.userId;
    }

    if (profileResponse.data.education) {
      isApplicant.value = true;
      applicantEducation.value = profileResponse.data.education.id;
      userId.value = profileResponse.data.userId;
      const response = await axios.get(`/cases/user/${userId.value}`);
      cases.value = response.data;

      openQuestions.value = cases.value.filter(c => c.status === 'Open' || c.status === 'In behandeling');
      handledQuestions.value = cases.value.filter(c => c.status === 'Gesloten');
    }

  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
}

function getData(institutionName, educationName) {
  const data = {
    id: id.value,
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    institution: {
      id: institution.value,
      name: institutionName.name,
    },
    phone: phone.value,
    image: image.value
  };

  if (isHandler.value) {
    data.typeOfLaws = handlerTypeOfLaws.value;
    data.subjects = handlerSubjects.value;
    data.userId = userId.value;
  }

  if (isApplicant.value) {
    data.education = {
      id: applicantEducation.value,
      name: educationName.name
    };
    data.userId = userId.value;
  }
  return data;
}

async function updateProfile() {
  try {
    const institutionName = dataStore.institutions.value.find(inst => inst.id === parseInt(institution.value));
    const educationName = dataStore.educations.value.find(edu => edu.id === parseInt(applicantEducation.value));

    const data = getData(institutionName, educationName);

    const response = await axios.put('/users/' + id.value, data);

    createdUser.value = {
      id: response.data.id,
      firstname: response.data.firstname,
      lastname: response.data.lastname,
      email: response.data.email
    };
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

async function deleteProfile() {
  try {
    await axios.delete('/users/' + id.value);
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
  authStore.logout();
  router.push('/login');
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

  id.value = authStore.userId;
  fetchData();
});

function viewDossier(dossierId) {
  router.push({ name: 'dossier', params: { id: dossierId } });
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    image.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function closeErrorModal() {
  showErrorModal.value = false;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}
</script>

<template>
  <div class="container mt-5">
    <h2>Mijn Gegevens</h2>
    <img :src="image || placeholderImage" alt="Profielfoto" class="img-thumbnail rounded-circle mb-3 profile-image" />
    <input type="file" @change="handleImageUpload" class="form-control mb-3" accept="image/*">
    <InputField label="Voornaam" v-model="firstname" placeholder="Voornaam" />
    <InputField label="Achternaam" v-model="lastname" placeholder="Achternaam" />
    <InputField label="E-mailadres" v-model="email" type="email" placeholder="E-mailadres" />
    <SelectField label="Instelling" v-model="institution" :options="dataStore.institutions" />
    <InputField label="phone" v-model="phone" placeholder="Telefoonnummer" />

    <!-- Velden voor de behandelaar -->
    <div v-if="isHandler">
      <h3>Behandelaar Gegevens</h3>
      <CheckboxGroupField label="Soorten Recht" v-model="handlerTypeOfLaws" :options="dataStore.typeOfLaws" />
      <CheckboxGroupField label="Onderwerpen" v-model="handlerSubjects" :options="dataStore.subjects" />
    </div>

    <!-- Velden voor de indiener -->
    <div v-if="isApplicant">
      <SelectField label="Opleiding" v-model="applicantEducation" :options="dataStore.educations" disabled />
    </div>

    <div class="d-flex gap-2 mt-4">
      <button class="btn btn-success" @click="updateProfile">Gegevens Bijwerken</button>
      <button class="btn btn-danger" @click="deleteProfile">Profiel Verwijderen</button>
    </div>

    <QuestionList title="Openstaande Vragen" :questions="openQuestions" :viewDossier="viewDossier" />
    <QuestionList title="Behandelde Vragen" :questions="handledQuestions" :viewDossier="viewDossier" />

    <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
    <UserModal :showModal="showSuccessModal" :createdUser="createdUser" @close="closeSuccessModal" @goToAccount="closeSuccessModal" />
  </div>
</template>

<style scoped>
.profile-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
}
</style>
