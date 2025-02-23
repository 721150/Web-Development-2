<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  buttonText: {
    type: String,
  },
  buttonLink: {
    type: String,
  }
});

function openWebsite() {
  window.open(props.buttonLink, '_blank');
}
</script>

<template>
  <div>
    <button class="btn btn-success custom-btn mb-3" @click="openWebsite">{{ props.buttonText }}</button>
  </div>
</template>

<style scoped>

</style>
