<script setup>
import { reactive, ref } from 'vue';
import GeneralInfo from "../components/GeneralInfo.vue";

const request = reactive({
  submitter: 'Jan Jansen',
  handler: 'Piet Pietersen',
  institution: 'Universiteit van Amsterdam',
  course: 'Rechten',
  subject: 'Examens',
  type: 'Beroeps',
  question: 'Wanneer kan ik beroep indienen?',
  documents: [
    { id: 1, name: 'Contract.pdf' },
    { id: 2, name: 'Voorwaarden.docx' }
  ],
  communication: [
    { id: 1, sender: 'Jan Jansen', text: 'Kunt u mij meer informatie geven over een beroep?' },
    { id: 2, sender: 'Piet Pietersen', text: 'Natuurlijk, ik zal de informatie zo snel mogelijk verstrekken.' }
  ],
  status: 'open'
});

const newMessage = ref('');

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    request.communication.push({
      id: request.communication.length + 1,
      sender: 'Ik',
      text: newMessage.value
    });
    newMessage.value = '';
  }
}

function updateStatus() {
  alert(`Status bijgewerkt naar: ${request.status}`);
}
</script>

<template>
  <div class="container mt-5">
    <h1>Verzoek gegevens</h1>
    <div class="card mb-3">
      <div class="card-body">
        <GeneralInfo title="Gegevens Indiener" :text="request.submitter" />
        <GeneralInfo title="Gegevens Behandelaar" :text="request.handler" />
        <GeneralInfo title="Instelling" :text="request.institution" />
        <GeneralInfo title="Opleiding" :text="request.course" />
        <GeneralInfo title="Onderwerp" :text="request.subject" />
        <GeneralInfo title="Soort Recht" :text="request.type" />
        <GeneralInfo title="Vraag" :text="request.question" />
        <h4 class="card-title fw-bold">Meegestuurde Documenten</h4>
        <ul class="list-group">
          <li class="list-group-item" v-for="document in request.documents" :key="document.id">{{ document.name }}</li>
        </ul>
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-body">
        <h2 class="card-title">Communicatie</h2>
        <ul class="list-group mb-3">
          <li class="list-group-item" v-for="message in request.communication" :key="message.id">
            <p><strong>{{ message.sender }}:</strong> {{ message.text }}</p>
          </li>
        </ul>
        <textarea class="form-control mb-3" v-model="newMessage" placeholder="Schrijf een bericht..."></textarea>
        <button class="btn btn-success" @click="sendMessage">Verstuur</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">Status Aanpassen</h2>
        <select class="form-select mb-3" v-model="request.status">
          <option value="open">Open</option>
          <option value="in behandeling">In Behandeling</option>
          <option value="gesloten">Gesloten</option>
        </select>
        <button class="btn btn-success" @click="updateStatus">Update Status</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
