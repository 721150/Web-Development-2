<script setup>
import { defineProps } from 'vue';
import NavigationButton from "@/components/NavigationButton.vue";

defineProps({
  title: String,
  questions: Array,
  viewDossier: Function
});
</script>

<template>
  <div>
    <h2 class="mt-5">{{ title }}</h2>
    <ul class="list-group">
      <li v-for="question in questions" :key="question.id" class="list-group-item d-flex justify-content-between align-items-center">
        {{ question.question }}
        <NavigationButton class="btn-sm" buttonText="Bekijk Dossier" buttonLink="/dossier" />
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
