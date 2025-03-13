<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: String,
  options: Array,
  defaultOptionText: String,
  defaultOptionValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <select :value="modelValue" @input="updateValue" class="form-select me-2">
    <option :value="defaultOptionValue">{{ defaultOptionText }}</option>
    <option v-for="option in options" :key="option.id" :value="option.name || option.description">{{ option.name || option.description }}</option>
  </select>
</template>

<style scoped>

</style>
