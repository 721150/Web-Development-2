<script setup>
import FieldDisplay from './FieldDisplay.vue';
import { reactive, ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import axios from '@/axios-auth.js';
import ErrorModal from "@/components/ErrorModal.vue";

const errorMessage = ref('');
const showErrorModal = ref(false);

const props = defineProps({
  blog: Object
});

const blog = reactive(props.blog);

const emit = defineEmits(['addComment']);

const newReactie = ref('');

function toggleComments() {
  blog.showComments = !blog.showComments;
}

async function addReactie() {
  if (newReactie.value.trim() !== '') {
    const reactie = {
      dateTime: new Date().toISOString(),
      content: newReactie.value
    };

    try {
      const response = await axios.post('/reacties', {
        blogId: blog.id,
        reactie: reactie
      });
      if (!blog.reacties) {
        blog.reacties = [];
      }
      blog.reacties.push(response.data);
      newReactie.value = '';
      emit('addComment', blog.id);
    } catch (error) {
      if (error.response) {
        errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
      } else {
        errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
      }
      showErrorModal.value = true;
    }
  }
}

function formatDateTime(dateTime) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return new Intl.DateTimeFormat('nl-NL', options).format(new Date(dateTime)).replace(',', '');
}

function closeErrorModal() {
  showErrorModal.value = false;
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ blog.title }}</h5>
      <FieldDisplay label="Tijd" :value="formatDateTime(blog.dateTime)" />
      <FieldDisplay label="Instelling" :value="blog.institution.name" />
      <FieldDisplay label="Opleiding" :value="blog.education.name" />
      <FieldDisplay label="Onderwerp" :value="blog.subject.description" />
      <FieldDisplay label="Soort recht" :value="blog.typeOfLaw.description" />
      <FieldDisplay label="Beschrijving" :value="blog.description" />
      <p class="card-text">{{ blog.content }}</p>
      <button class="btn btn-success" @click="toggleComments">{{ blog.showComments ? 'Verberg reacties' : 'Toon reacties' }}</button>
      <div v-if="blog.showComments" class="mt-3">
        <p v-for="reactie in blog.reacties" :key="reactie.id" class="mb-2">{{ formatDateTime(reactie.dateTime) }}: {{ reactie.content }}</p>
        <input v-model="newReactie" type="text" class="form-control mb-2" placeholder="Schrijf een reactie">
        <button class="btn btn-success" @click="addReactie">Plaats reactie</button>
      </div>
    </div>
  </div>
  <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
</template>

<style scoped>

</style>
