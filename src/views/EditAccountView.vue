<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import InputField from '../components/InputField.vue';
import SelectField from "@/components/SelectField.vue";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";
import ErrorModal from "@/components/ErrorModal.vue";
import UserModal from "@/components/UserModal.vue";
import { useRoute, useRouter } from "vue-router";
import { useDataStore } from "@/stores/data.js";
import { useAuthStore } from "@/stores/auth.js";

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const authStore = useAuthStore();

const id = ref(route.params.id);
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const institution = ref('');
const phone = ref('');
const image = ref('');
const userId = ref('');
const placeholderImage = 'src/assets/placeholder.jpg';

const errorMessage = ref('');
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const createdUser = ref(null);

const isHandler = ref(false);
const isApplicant = ref(false);
const handlerTypeOfLaws = ref([]);
const handlerSubjects = ref([]);
const applicantEducation = ref('');

async function fetchData() {
  try {
    const response = await axios.get('/users/' + id.value);

    firstname.value = response.data.firstname;
    lastname.value = response.data.lastname;
    email.value = response.data.email;
    institution.value = response.data.institution.id;
    phone.value = response.data.phone;
    image.value = response.data.image;

    if (response.data.typeOfLaws && response.data.subjects) {
      isHandler.value = true;
      handlerTypeOfLaws.value = response.data.typeOfLaws;
      handlerSubjects.value = response.data.subjects;
      userId.value = response.data.userId;
    }

    if (response.data.education) {
      isApplicant.value = true;
      applicantEducation.value = response.data.education.id;
      userId.value = response.data.userId;
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

async function updateProfile() {
  try {
    const institutionName = dataStore.institutions.find(inst => inst.id === parseInt(institution.value));
    const educationName = dataStore.educations.find(edu => edu.id === parseInt(applicantEducation.value));

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
      image: image.value,
      userId: userId.value,
    };

    if (isHandler.value) {
      data.typeOfLaws = handlerTypeOfLaws.value;
      data.subjects = handlerSubjects.value;
    }

    if (isApplicant.value) {
      data.education = {
        id: applicantEducation.value,
        name: educationName.name
      };
    }

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

onMounted(async () => {
  if (!authStore.isLoggedIn || authStore.userRole !== "Beheerder") {
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

  fetchData();
});

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

function toUserList() {
  router.push('/manage-accounts');
}
</script>

<template>
  <div class="container mt-5">
    <h2>Gebruikersgegevens bewerken</h2>
    <img :src="image || placeholderImage" alt="Profielfoto" class="img-thumbnail rounded-circle mb-3 profile-image" />
    <input type="file" @change="handleImageUpload" class="form-control mb-3" accept="image/*">
    <InputField label="Voornaam" v-model="firstname" placeholder="Voornaam" />
    <InputField label="Achternaam" v-model="lastname" placeholder="Achternaam" />
    <InputField label="E-mailadres" v-model="email" type="email" placeholder="E-mailadres" />
    <SelectField label="Instelling" v-model="institution" :options="dataStore.institutions" />
    <InputField label="Telefoonnummer" v-model="phone" placeholder="Telefoonnummer" />

    <!-- Velden voor de behandelaar -->
    <div v-if="isHandler">
      <h3>Behandelaar Gegevens</h3>
      <CheckboxGroupField label="Soorten Recht" v-model="handlerTypeOfLaws" :options="dataStore.typeOfLaws" />
      <CheckboxGroupField label="Onderwerpen" v-model="handlerSubjects" :options="dataStore.subjects" />
    </div>

    <!-- Velden voor de indiener -->
    <div v-if="isApplicant">
      <SelectField label="Opleiding" v-model="applicantEducation" :options="dataStore.educations" />
    </div>

    <div class="d-flex gap-2 mt-4">
      <button class="btn btn-success mb-4" @click="updateProfile">Gegevens Bijwerken</button>
      <button class="btn btn-primary mb-4" @click="toUserList">Naar alle gebruikers</button>
    </div>

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
