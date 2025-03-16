<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
  label: String,
  modelValue: [String, Number],
  options: Array
});

const emit = defineEmits(['update:modelValue']);

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <div class="mb-3">
    <label :for="label" class="form-label">{{ label }}</label>
    <select :id="label" class="form-select" @change="updateValue" :value="modelValue">
      <option value="">Selecteer een optie</option>
      <option v-for="option in options" :key="option.id" :value="option.id">{{ option.name }}</option>
    </select>
  </div>
</template>

<style scoped>

</style>
