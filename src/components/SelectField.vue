<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  label: String,
  modelValue: Object,
  options: Array
});

const emit = defineEmits(['update:modelValue']);

function updateValue(event) {
  const selectedOption = props.options.find(option => option.id === parseInt(event.target.value));
  emit('update:modelValue', selectedOption);
}
</script>

<template>
  <div class="mb-3">
    <label :for="label" class="form-label">{{ label }}</label>
    <select :id="label" class="form-select" @change="updateValue">
      <option value="">Selecteer een optie</option>
      <option v-for="option in options" :key="option.id" :value="option.id">{{ option.name || option.description }}</option>
    </select>
  </div>
</template>

<style scoped>

</style>
