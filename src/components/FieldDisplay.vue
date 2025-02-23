<script setup>
import { defineProps } from 'vue';

defineProps({
  label: String,
  value: String
});
</script>

<template>
  <div class="d-flex">
    <p class="fw-bold">{{ label }}:</p>
    <p class="ms-2">{{ value }}</p>
  </div>
</template>

<style scoped>

</style>
