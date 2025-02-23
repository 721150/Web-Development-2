<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SelectField from '../components/SelectField.vue';

const router = useRouter();

const title = ref('');
const institution = ref('');
const course = ref('');
const topic = ref('');
const rightType = ref('');
const content = ref('');

const institutions = ['Instelling A', 'Instelling B', 'Instelling C'];
const courses = ['Opleiding X', 'Opleiding Y', 'Opleiding Z'];
const topics = ['Onderwerp 1', 'Onderwerp 2', 'Onderwerp 3'];
const rightTypes = ['Recht A', 'Recht B', 'Recht C'];

function createPost() {
  console.log('Post created:', {
    title: title.value,
    institution: institution.value,
    course: course.value,
    topic: topic.value,
    rightType: rightType.value,
    content: content.value,
    time: new Date().toISOString(),
    comments: []
  });
  router.push('/blogs');
}
</script>

<template>
  <div class="container mt-5">
    <h2>Nieuw bericht maken</h2>
    <div class="mb-3">
      <label for="title" class="form-label">Titel</label>
      <input v-model="title" type="text" class="form-control" id="title" placeholder="Titel">
    </div>
    <SelectField label="Instelling" v-model="institution" :options="institutions" />
    <SelectField label="Opleiding" v-model="course" :options="courses" />
    <SelectField label="Onderwerp" v-model="topic" :options="topics" />
    <SelectField label="Soort recht" v-model="rightType" :options="rightTypes" />
    <div class="mb-3">
      <label for="content" class="form-label">Inhoud</label>
      <textarea v-model="content" class="form-control" id="content" rows="3" placeholder="Inhoud"></textarea>
    </div>
    <button class="btn btn-success" @click="createPost">Bericht maken</button>
  </div>
</template>

<style scoped>

</style>
