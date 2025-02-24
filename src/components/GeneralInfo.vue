<script setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="mb-3">
    <h4 class="card-title fw-bold">{{ title }}</h4>
    <p class="card-text">{{ text }}</p>
  </div>
</template>

<style scoped>

</style>
