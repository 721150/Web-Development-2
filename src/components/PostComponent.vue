<script setup>
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
    props.post.comments.push({ id: Date.now(), author: 'Anonieme Student', text: newComment.value });
    newComment.value = '';
    emit('addComment', props.post.id);
  }
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text">{{ post.content }}</p>
      <button class="btn btn-success" @click="toggleComments">{{ post.showComments ? 'Verberg reacties' : 'Toon reacties' }}</button>
      <div v-if="post.showComments" class="mt-3">
        <div v-for="comment in post.comments" :key="comment.id" class="mb-2">
          <strong>{{ comment.author }}</strong>: {{ comment.text }}
        </div>
        <input v-model="newComment" type="text" class="form-control mb-2" placeholder="Schrijf een reactie">
        <button class="btn btn-success" @click="addComment">Plaats reactie</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
