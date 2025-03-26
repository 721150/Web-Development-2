<script setup>
import { onMounted, ref } from 'vue';
import GeneralInfo from "../components/GeneralInfo.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import axios from "@/axios-auth.js";

const authStore = useAuthStore();
const router = useRouter();

const request = ref([]);

const newMessage = ref('');

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  try {
    const dossierId = router.currentRoute.value.params.id;
    const response = await axios.get(`/cases/case/${dossierId}`);

    const data = response.data;

    request.value.submitter = `${data.user.firstname} ${data.user.lastname}`;
    request.value.handler = data.handler ? `${data.handler.firstname} ${data.handler.lastname}` : 'Niet toegewezen';
    request.value.institution = data.institution.name;
    request.value.course = data.education.name;
    request.value.subject = data.subject.description;
    request.value.type = data.typeOfLaw.description;
    request.value.question = data.content;
    request.value.documents = data.documents.map(doc => ({
      id: doc.id,
      name: 'Document ' + doc.id,
      url: 'http://localhost/' + doc.document
    }));
    request.value.status = data.status;
  } catch (error) {
    console.error('Error fetching dossier data:', error);
  }
});
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
        <h4 class="card-title fw-bold">Meegestuurd Document</h4>
        <ul class="list-group">
          <li class="list-group-item" v-for="document in request.documents" :key="document.id">
            <a :href="document.url" target="_blank" class="text-primary">{{ document.name }}</a>
          </li>
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
          <option value="Open">Open</option>
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
