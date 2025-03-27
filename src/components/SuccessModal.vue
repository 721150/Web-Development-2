<script setup>
defineProps({
  showModal: Boolean,
  message: String
});

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>

<template>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header text-black">
          <h5 class="modal-title">Handeling succesvol!</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-black">
          <p>{{ message }}</p>
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
