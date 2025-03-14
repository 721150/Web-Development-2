<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import InputField from "@/components/InputField.vue";
import SelectField from "@/components/SelectField.vue";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";

const role = ref('applicant');
const user = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  institution: '',
  phone: '',
  education: '',
  typeOfLaws: [],
  subjects: [],
  image: null
});

const institutions = ref([]);
const educations = ref([]);
const typeOfLaws = ref([]);
const subjects = ref([]);
const errorMessage = ref('');
const showErrorModal = ref(false);

const updateFields = () => {
  user.value.education = '';
  user.value.typeOfLaws = [];
  user.value.subjects = [];
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  user.value.image = file;
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('firstname', user.value.firstname);
  formData.append('lastname', user.value.lastname);
  formData.append('email', user.value.email);
  formData.append('password', user.value.password);
  formData.append('institution', user.value.institution);
  formData.append('phone', user.value.phone);
  formData.append('role', role.value);

  if (user.value.image) {
    formData.append('image', user.value.image);
  }

  if (role.value === 'applicant') {
    formData.append('education', user.value.education);
  } else if (role.value === 'handler') {
    formData.append('typeOfLaws', user.value.typeOfLaws);
    formData.append('subjects', user.value.subjects);
  }

  try {
    const response = await axios.post('/users/' . role, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Form data successfully submitted:', response.data);
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Server fout: ${error.response.status} - ${error.response.data.message}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het versturen van de gegevens.';
    }
    showErrorModal.value = true;
  }
};

onMounted(async () => {
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
    if (error.response) {
      errorMessage.value = `Server fout: ${error.response.status} - ${error.response.data.message}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
});
</script>

<template>
  <div>
    <h1>Create New User</h1>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="role" class="form-label">Role:</label>
        <select v-model="role" @change="updateFields" class="form-select">
          <option value="applicant">Indiener</option>
          <option value="handler">Behandelaar</option>
          <option value="admin">Beheerder</option>
        </select>
      </div>

      <InputField label="Voornaam" v-model="user.firstname" type="text" placeholder="Voornaam" />
      <InputField label="Achternaam" v-model="user.lastname" type="text" placeholder="Achternaam" />
      <InputField label="E-mailadres" v-model="user.email" type="email" placeholder="E-mailadres" />
      <InputField label="Wachtwoord" v-model="user.password" type="password" placeholder="Wachtwoord" />

      <SelectField label="Instelling" v-model="user.institution" :options="institutions" />
      <InputField label="Telefoonnummer" v-model="user.phone" type="text" placeholder="Telefoonnummer" />

      <div class="mb-3">
        <label for="image" class="form-label">Image:</label>
        <input type="file" @change="handleFileUpload" class="form-control" />
      </div>

      <div v-if="role === 'applicant'" class="mb-3">
        <SelectField label="Opleiding" v-model="user.education" :options="educations" />
      </div>

      <CheckboxGroupField v-if="role === 'handler'" label="Soort recht" v-model="user.typeOfLaws" :options="typeOfLaws" />
      <CheckboxGroupField v-if="role === 'handler'" label="Onderwerp" v-model="user.subjects" :options="subjects" />

      <button type="submit" class="btn btn-success">Create User</button>
    </form>
  </div>
</template>

<style scoped>

</style>
