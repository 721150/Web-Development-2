<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  showModal: Boolean,
  errorMessage: String
});

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>

<template>
  <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content text-black">
        <div class="modal-header">
          <h5 class="modal-title">Foutmelding</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p class="text-danger"><strong>Fout:</strong> {{ errorMessage }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Sluiten</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
