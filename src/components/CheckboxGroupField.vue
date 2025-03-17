<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: String,
  modelValue: Array,
  options: Array
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event, option) => {
  const selectedOptions = [...props.modelValue];
  if (event.target.checked) {
    if (!selectedOptions.some(item => item.id === option.id)) {
      selectedOptions.push(option);
    }
  } else {
    const index = selectedOptions.findIndex(item => item.id === option.id);
    if (index !== -1) {
      selectedOptions.splice(index, 1);
    }
  }
  emit('update:modelValue', selectedOptions);
};
</script>

<template>
  <div class="mb-3">
    <label class="form-label">{{ label }}</label>
    <div v-for="option in options" :key="option.id" class="form-check">
      <input type="checkbox" :value="option" class="form-check-input" @change="event => updateValue(event, option)" :checked="modelValue.some(item => item.id === option.id)" />
      <label class="form-check-label">{{ option.description }}</label>
    </div>
  </div>
</template>

<style scoped>
</style>
