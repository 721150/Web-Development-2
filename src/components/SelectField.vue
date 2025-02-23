<script setup>
import { defineProps } from 'vue';

defineProps({
  label: String,
  modelValue: String,
  options: Array
});

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <div class="mb-3">
    <label :for="label" class="form-label">{{ label }}</label>
    <select :id="label" class="form-select" :value="modelValue" @input="updateValue">
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<style scoped>

</style>
