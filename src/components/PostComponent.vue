<script setup>
import FieldDisplay from './FieldDisplay.vue';
import { reactive, ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import axios from '@/axios-auth.js';

const props = defineProps({
  blog: Object
});

const blog = reactive(props.blog);

const emit = defineEmits(['addComment']);

const newComment = ref('');

function toggleComments() {
  blog.showComments = !blog.showComments;
}

async function addComment() {
  if (newComment.value.trim() !== '') {
    const reactie = {
      dateTime: new Date().toISOString(),
      content: newComment.value
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
      newComment.value = '';
      emit('addComment', blog.id);
    } catch (error) {
      console.error('Error adding comment:', error);
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
      <button class="btn btn-success" @click="toggleComments">{{
          blog.showComments ? 'Verberg reacties' : 'Toon reacties'
        }}</button>
      <div v-if="blog.showComments" class="mt-3">
        <p v-for="reactie in blog.reacties" :key="reactie.id" class="mb-2">{{ formatDateTime(reactie.dateTime) }}: {{ reactie.content }}</p>
        <input v-model="newComment" type="text" class="form-control mb-2" placeholder="Schrijf een reactie">
        <button class="btn btn-success" @click="addComment">Plaats reactie</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
