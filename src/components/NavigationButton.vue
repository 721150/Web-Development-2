<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  buttonText: {
    type: String,
    required: true
  },
  buttonLink: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['navigate']);

const router = useRouter();

function navigate() {
  router.push(props.buttonLink);
  emit('navigate');
}
</script>

<template>
  <button class="btn btn-success ms-3" @click="navigate">{{ props.buttonText }}</button>
</template>

<style scoped>

</style>
