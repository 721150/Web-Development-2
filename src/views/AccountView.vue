<script setup>
import { ref } from 'vue';
import InputField from '../components/InputField.vue';
import QuestionList from '../components/QuestionList.vue';

const firstname = ref('John');
const lastname = ref('Doe');
const email = ref('john.doe@example.com');

const openQuestions = ref([
  { id: 1, question: 'How can I appeal a decision by the exam committee?', status: 'open' },
  { id: 2, question: 'What are my rights regarding exam retakes?', status: 'open' }
]);

const handledQuestions = ref([
  { id: 3, question: 'How do I request a transcript?', status: 'handled' },
  { id: 4, question: 'What is the process for changing my major?', status: 'handled' }
]);

function updateProfile() {
  console.log('Profile updated:', {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value
  });
}

function deleteProfile() {
  console.log('Profile deleted');
}
</script>

<template>
  <div class="container mt-5">
    <h2>Mijn Gegevens</h2>
    <InputField label="Voornaam" v-model="firstname" placeholder="Voornaam" />
    <InputField label="Achternaam" v-model="lastname" placeholder="Achternaam" />
    <InputField label="E-mailadres" v-model="email" type="email" placeholder="E-mailadres" />
    <button class="btn btn-primary" @click="updateProfile">Gegevens Bijwerken</button>
    <button class="btn btn-danger" @click="deleteProfile">Profiel Verwijderen</button>

    <QuestionList title="Openstaande Vragen" :questions="openQuestions" :viewDossier="viewDossier" />
    <QuestionList title="Behandelde Vragen" :questions="handledQuestions" :viewDossier="viewDossier" />
  </div>
</template>

<style scoped>

</style>
