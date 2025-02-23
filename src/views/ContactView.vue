<script setup>
import { ref } from 'vue';
import SelectField from '../components/SelectField.vue';
import InputField from '../components/InputField.vue';

const name = ref('');
const email = ref('');
const question = ref('');
const institution = ref('');
const course = ref('');
const topic = ref('');
const rightType = ref('');
const files = ref([]);

const institutions = ['Instelling A', 'Instelling B', 'Instelling C'];
const courses = ['Opleiding X', 'Opleiding Y', 'Opleiding Z'];
const topics = ['Onderwerp 1', 'Onderwerp 2', 'Onderwerp 3'];
const rightTypes = ['Recht A', 'Recht B', 'Recht C'];

function handleFileUpload(event) {
  const newFiles = Array.from(event.target.files);
  files.value = files.value.concat(newFiles);
}

function submitForm() {
  console.log('Form submitted:', {
    name: name.value,
    email: email.value,
    question: question.value,
    institution: institution.value,
    course: course.value,
    topic: topic.value,
    rightType: rightType.value,
    files: files.value
  });
}
</script>

<template>
  <div class="container mt-5">
    <h2>Leg een casus voor over je rechten</h2>
    <InputField label="Voornaam" v-model="firstname" placeholder="Voornaam" />
    <InputField label="Achternaam" v-model="lastname" placeholder="Achternaam" />
    <InputField label="E-mailadres" v-model="email" type="email" placeholder="E-mailadres" />
    <SelectField label="Instelling" v-model="institution" :options="institutions" />
    <SelectField label="Opleiding" v-model="course" :options="courses" />
    <SelectField label="Onderwerp" v-model="topic" :options="topics" />
    <SelectField label="Soort recht" v-model="rightType" :options="rightTypes" />
    <div class="mb-3">
      <label for="question" class="form-label">Casus</label>
      <textarea v-model="question" class="form-control" id="question" rows="3" placeholder="Beschrijf je casus"></textarea>
    </div>
    <div class="mb-3">
      <label for="file" class="form-label">Documenten</label>
      <input type="file" class="form-control" id="files" multiple @change="handleFileUpload">
    </div>
    <div class="mb-3">
      <h5>Geselecteerde bestanden:</h5>
      <ul>
        <li v-for="file in files" :key="file.name">{{ file.name }}</li>
      </ul>
    </div>
    <button class="btn btn-success" @click="submitForm">Verstuur</button>
  </div>
</template>

<style scoped>

</style>
