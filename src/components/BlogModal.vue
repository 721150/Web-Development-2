<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  showModal: Boolean,
  createdPost: Object
});

const emit = defineEmits(['close', 'goToBlogs']);

function closeModal() {
  emit('close');
}

function goToBlogs() {
  emit('goToBlogs');
}
</script>

<template>
  <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content text-black">
        <div class="modal-header">
          <h5 class="modal-title">Nieuwe blog aangemaakt</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p><strong>Beschrijving:</strong> {{ createdPost.description }}</p>
          <p><strong>Instelling:</strong> {{ createdPost.institution.name }}</p>
          <p><strong>Opleiding:</strong> {{ createdPost.education.name }}</p>
          <p><strong>Onderwerp:</strong> {{ createdPost.subject.description }}</p>
          <p><strong>Soort recht:</strong> {{ createdPost.typeOfLaw.description }}</p>
          <p><strong>Inhoud:</strong> {{ createdPost.content }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="goToBlogs">Terug naar alle blogs</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
