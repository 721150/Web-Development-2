<script setup>
import FieldDisplay from './FieldDisplay.vue';
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  post: Object
});

const emit = defineEmits(['addComment']);

const newComment = ref('');

function toggleComments() {
  props.post.showComments = !props.post.showComments;
}

function addComment() {
  if (newComment.value.trim() !== '') {
    props.post.comments.push({ id: Date.now(), text: newComment.value, time: new Date().toISOString() });
    newComment.value = '';
    emit('addComment', props.post.id);
  }
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ props.post.title }}</h5>
      <FieldDisplay label="Tijd" :value="props.post.time" />
      <FieldDisplay label="Instelling" :value="props.post.institution" />
      <FieldDisplay label="Opleiding" :value="props.post.course" />
      <FieldDisplay label="Onderwerp" :value="props.post.topic" />
      <FieldDisplay label="Soort recht" :value="props.post.rightType" />
      <p class="card-text">{{ post.content }}</p>
      <button class="btn btn-success" @click="toggleComments">{{ props.post.showComments ? 'Verberg reacties' : 'Toon reacties' }}</button>
      <div v-if="props.post.showComments" class="mt-3">
        <p v-for="comment in props.post.comments" :key="comment.id" class="mb-2">{{ comment.time }}: {{ comment.text }}</p>
        <input v-model="newComment" type="text" class="form-control mb-2" placeholder="Schrijf een reactie">
        <button class="btn btn-success" @click="addComment">Plaats reactie</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
