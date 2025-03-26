<script setup>
import { defineProps } from 'vue';

defineProps({
  title: String,
  questions: Array,
  viewDossier: Function
});
</script>

<template>
  <div class="mb-4">
    <h2 class="mt-5">{{ title }}</h2>
    <ul class="list-group">
      <li v-for="question in questions" :key="question.id" class="list-group-item d-flex justify-content-between align-items-center">
        {{ question.content }}
        <button class="btn btn-sm btn-success" @click="viewDossier(question.id)">Bekijk Dossier</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
