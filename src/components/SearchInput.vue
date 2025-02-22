<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <input :value="modelValue" @input="updateValue" type="text" class="form-control mb-3" placeholder="Zoeken op instelling, opleiding, onderwerp of soort recht">
</template>

<style scoped>

</style>
