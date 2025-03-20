<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SelectField from '../components/SelectField.vue';
import BlogModal from '../components/BlogModal.vue';
import ErrorModal from '../components/ErrorModal.vue';
import axios from '@/axios-auth.js';
import {useAuthStore} from "@/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const description = ref('');
const institution = ref('');
const education = ref('');
const subject = ref('');
const typeOfLaw = ref('');
const content = ref('');

const institutions = ref([]);
const educations = ref([]);
const subjects = ref([]);
const typesOfLaws = ref([]);

const showModal = ref(false);
const showErrorModal = ref(false);
const createdPost = ref(null);
const errorMessage = ref('');
const validationErrors = ref({});

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

    const typesOfLawsResponse = await axios.get('/typesOfLows');
    typesOfLaws.value = typesOfLawsResponse.data;
  } catch (error) {
    errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.message}`;
    showErrorModal.value = true;
  }
});

function validateForm() {
  validationErrors.value = {};

  if (!description.value) {
    validationErrors.value.description = 'Beschrijving is verplicht.';
  }
  if (!institution.value) {
    validationErrors.value.institution = 'Instelling is verplicht.';
  }
  if (!education.value) {
    validationErrors.value.education = 'Opleiding is verplicht.';
  }
  if (!subject.value) {
    validationErrors.value.subject = 'Onderwerp is verplicht.';
  }
  if (!typeOfLaw.value) {
    validationErrors.value.typeOfLaw = 'Soort recht is verplicht.';
  }
  if (!content.value) {
    validationErrors.value.content = 'Inhoud is verplicht.';
  }

  return Object.keys(validationErrors.value).length === 0;
}

async function createPost() {
  if (!validateForm()) {
    errorMessage.value = 'Vul alle verplichte velden in.';
    showErrorModal.value = true;
    return;
  }

  try {
    const selectedInstitution = institutions.value.find(inst => inst.id === parseInt(institution.value));
    const selectedEducation = educations.value.find(edu => edu.id === parseInt(education.value));
    const selectedSubject = subjects.value.find(sub => sub.id === parseInt(subject.value));
    const selectedTypeOfLaw = typesOfLaws.value.find(type => type.id === parseInt(typeOfLaw.value));

    const newPost = {
      institution: {
        id: institution.value,
        name: selectedInstitution.name
      },
      education: {
        id: education.value,
        name: selectedEducation.name
      },
      subject: {
        id: subject.value,
        description: selectedSubject.description
      },
      typeOfLaw: {
        id: typeOfLaw.value,
        description: selectedTypeOfLaw.description
      },
      description: description.value,
      content: content.value,
    };

    const response = await axios.post('/blogs', newPost);
    createdPost.value = response.data;
    errorMessage.value = '';
    showModal.value = true;
  } catch (error) {
    errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.message}`;
    showErrorModal.value = true;
  }
}

function closeModal() {
  showModal.value = false;
}

function closeErrorModal() {
  showErrorModal.value = false;
}

function goToBlogs() {
  router.push('/blogs');
}
</script>

<template>
  <div class="container mt-5">
    <h2>Nieuw bericht maken</h2>
    <div class="mb-3">
      <div v-if="validationErrors.description" class="text-danger">{{ validationErrors.description }}</div>
      <label for="title" class="form-label">Titel</label>
      <input v-model="description" type="text" class="form-control" id="title" placeholder="Titel">
    </div>
    <div v-if="validationErrors.institution" class="text-danger">{{ validationErrors.institution }}</div>
    <SelectField label="Instelling" v-model="institution" :options="institutions" />
    <div v-if="validationErrors.education" class="text-danger">{{ validationErrors.education }}</div>
    <SelectField label="Opleiding" v-model="education" :options="educations" />
    <div v-if="validationErrors.subject" class="text-danger">{{ validationErrors.subject }}</div>
    <SelectField label="Onderwerp" v-model="subject" :options="subjects" />
    <div v-if="validationErrors.typeOfLaw" class="text-danger">{{ validationErrors.typeOfLaw }}</div>
    <SelectField label="Soort recht" v-model="typeOfLaw" :options="typesOfLaws" />
    <div class="mb-3">
      <div v-if="validationErrors.content" class="text-danger">{{ validationErrors.content }}</div>
      <label for="content" class="form-label">Inhoud</label>
      <textarea v-model="content" class="form-control" id="content" rows="3" placeholder="Inhoud"></textarea>
    </div>
    <button class="btn btn-success" @click="createPost">Bericht maken</button>

    <BlogModal :showModal="showModal" :createdPost="createdPost" @close="closeModal" @goToBlogs="goToBlogs" />
    <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
  </div>
</template>

<style scoped>

</style>
