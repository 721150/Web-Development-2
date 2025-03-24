<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import InputField from "@/components/InputField.vue";
import SelectField from "@/components/SelectField.vue";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";
import ErrorModal from "@/components/ErrorModal.vue";
import UserModal from "@/components/UserModal.vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/stores/data.js";

const router = useRouter();
const dataStore = useDataStore();

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

const errorMessage = ref('');
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const createdUser = ref(null);

const updateFields = () => {
  user.value.education = '';
  user.value.typeOfLaws = [];
  user.value.subjects = [];
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  user.value.image = file;
};

function closeErrorModal() {
  showErrorModal.value = false;
}

const submitForm = async () => {
  const selectedInstitution = dataStore.institutions.find(inst => inst.id === parseInt(user.value.institution));
  const selectedEducation = dataStore.educations.find(edu => edu.id === parseInt(user.value.education));

  const data = {
    firstname: user.value.firstname,
    lastname: user.value.lastname,
    email: user.value.email,
    password: user.value.password,
    institution: {
      id: user.value.institution,
      name:  selectedInstitution.name
    },
    phone: user.value.phone,
    image: null,
    education: selectedEducation ? {
      id: user.value.education,
      name: selectedEducation.name
    } : null,
    typeOfLaws: user.value.typeOfLaws,
    subjects: user.value.subjects
  };

  if (user.value.image) {
    const reader = new FileReader();
    reader.onloadend = async function() {
      data.image = reader.result.replace("data:", "").replace(/^.+,/, "");

      await sendJsonData(data);
    };
    reader.readAsDataURL(user.value.image);
  } else {
    await sendJsonData(data);
  }
};

const sendJsonData = async (data) => {
  try {
    const response = await axios.post('/users/' + role.value, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
};

onMounted(async () => {
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

function closeSuccessModal() {
  showSuccessModal.value = false;
}

function goToAccount() {
  router.push('/account');
}
</script>

<template>
  <div>
    <h1>Create New User</h1>
    <form @submit.prevent="submitForm">
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

      <SelectField label="Instelling" v-model="user.institution" :options="dataStore.institutions" />
      <InputField label="Telefoonnummer" v-model="user.phone" type="text" placeholder="Telefoonnummer" />

      <div class="mb-3">
        <label for="image" class="form-label">Image:</label>
        <input type="file" @change="handleFileUpload" class="form-control" />
      </div>

      <div v-if="role === 'applicant'" class="mb-3">
        <SelectField label="Opleiding" v-model="user.education" :options="dataStore.educations" />
      </div>

      <CheckboxGroupField v-if="role === 'handler'" label="Soort recht" v-model="user.typeOfLaws" :options="dataStore.typeOfLaws" />
      <CheckboxGroupField v-if="role === 'handler'" label="Onderwerp" v-model="user.subjects" :options="dataStore.subjects" />

      <button type="submit" class="btn btn-success">Create User</button>
    </form>
    <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
    <UserModal :showModal="showSuccessModal" :createdUser="createdUser" @close="closeSuccessModal" @goToAccount="goToAccount" />
  </div>
</template>

<style scoped>

</style>
