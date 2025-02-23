<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String
});

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <div class="mb-3">
    <label :for="label" class="form-label">{{ label }}</label>
    <input :type="type" :id="label" class="form-control" :value="modelValue" :placeholder="placeholder" @input="updateValue">
  </div>
</template>

<style scoped>

</style>
