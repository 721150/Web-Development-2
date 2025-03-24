<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  showModal: Boolean,
  createdUser: Object
});

const emit = defineEmits(['close', 'goToAccount']);

function closeModal() {
  emit('close');
}

function goToAccount() {
  emit('goToAccount');
}
</script>

<template>
  <div v-if="showModal && createdUser !== null" class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content text-black">
        <div class="modal-header">
          <h5 class="modal-title">Nieuwe gebruiker aangemaakt</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p><strong>Id:</strong> {{ createdUser.id }}</p>
          <p><strong>Voornaam:</strong> {{ createdUser.firstname }}</p>
          <p><strong>Achternaam:</strong> {{ createdUser.lastname }}</p>
          <p><strong>E-mailadres:</strong> {{ createdUser.email }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="goToAccount">Naar account</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
