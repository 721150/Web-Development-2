<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import InputField from '../components/InputField.vue';
import QuestionList from '../components/QuestionList.vue';
import SelectField from "@/components/SelectField.vue";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

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

const institutions = ref([]);
const educations = ref([]);
const typeOfLaws = ref([]);
const subjects = ref([]);
const errorMessage = ref('');
const showErrorModal = ref(false);

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
    }

    // const questionsResponse = await axios.get('/questions');
    // openQuestions.value = questionsResponse.data.filter(q => q.status === 'open');
    // handledQuestions.value = questionsResponse.data.filter(q => q.status === 'handled');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateProfile() {
  try {
    const institutionName = institutions.value.find(inst => inst.id === parseInt(institution.value));
    const educationName = educations.value.find(edu => edu.id === parseInt(applicantEducation.value));

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

    const response = await axios.put('/users/' + id.value, data);

    console.log('Profile updated: ' + response.data);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
}

async function deleteProfile() {
  try {
    await axios.delete('/users/' + id.value);
    console.log('Profile deleted');
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
}

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  try {
    const institutionsResponse = await axios.get('/institutions');
    institutions.value = institutionsResponse.data;

    const educationsResponse = await axios.get('/educations');
    educations.value = educationsResponse.data;

    const subjectsResponse = await axios.get('/subjects');
    subjects.value = subjectsResponse.data;

    const typesOfLowsResponse = await axios.get('/typesOfLows');
    typeOfLaws.value = typesOfLowsResponse.data;
  } catch (error) {
    errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage()}`;
    showErrorModal.value = true;
  }

  id.value = authStore.userId;
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
</script>

<template>
  <div class="container mt-5">
    <h2>Mijn Gegevens</h2>
    <img :src="image || placeholderImage" alt="Profielfoto" class="img-thumbnail rounded-circle mb-3 profile-image" />
    <input type="file" @change="handleImageUpload" class="form-control mb-3" accept="image/*">
    <InputField label="Voornaam" v-model="firstname" placeholder="Voornaam" />
    <InputField label="Achternaam" v-model="lastname" placeholder="Achternaam" />
    <InputField label="E-mailadres" v-model="email" type="email" placeholder="E-mailadres" />
    <SelectField label="Instelling" v-model="institution" :options="institutions" />
    <InputField label="phone" v-model="phone" placeholder="Telefoonnummer" />

    <!-- Velden voor de behandelaar -->
    <div v-if="isHandler">
      <h3>Behandelaar Gegevens</h3>
      <CheckboxGroupField label="Soorten Recht" v-model="handlerTypeOfLaws" :options="typeOfLaws" />
      <CheckboxGroupField label="Onderwerpen" v-model="handlerSubjects" :options="subjects" />
    </div>

    <!-- Velden voor de indiener -->
    <div v-if="isApplicant">
      <SelectField label="Opleiding" v-model="applicantEducation" :options="educations" disabled />
    </div>

    <div class="d-flex gap-2 mt-4">
      <button class="btn btn-primary" @click="updateProfile">Gegevens Bijwerken</button>
      <button class="btn btn-danger" @click="deleteProfile">Profiel Verwijderen</button>
    </div>

    <QuestionList title="Openstaande Vragen" :questions="openQuestions" :viewDossier="viewDossier" />
    <QuestionList title="Behandelde Vragen" :questions="handledQuestions" :viewDossier="viewDossier" />
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
