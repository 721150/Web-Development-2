<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import SearchInput from '../components/SearchInput.vue';
import FilterSelect from '../components/FilterSelect.vue';
import NavigationButton from '../components/NavigationButton.vue';
import PostComponent from '../components/PostComponent.vue';
import ErrorModal from "@/components/ErrorModal.vue";
import { useDataStore } from "@/stores/data.js";

const dataStore = useDataStore();

const searchQuery = ref('');
const selectedInstitution = ref('');
const selectedEducation = ref('');
const selectedSubject = ref('');
const selectedTypeOfLaw = ref('');
const newReactie = ref('');

const blogs = ref([]);

const errorMessage = ref('');
const showErrorModal = ref(false);

const filteredBlogs = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return blogs.value.filter(blog => {
    // Filteren op zoekopdracht
    const matchesSearchQuery = query === '' ||
      blog.description.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.institution.name.toLowerCase().includes(query) ||
      blog.education.name.toLowerCase().includes(query) ||
      blog.subject.description.toLowerCase().includes(query) ||
      blog.typeOfLaw.description.toLowerCase().includes(query);

    // Filteren op selectie (en zoekopdracht)
    return (
      (selectedInstitution.value === '' || blog.institution.name === selectedInstitution.value) &&
      (selectedEducation.value === '' || blog.education.name === selectedEducation.value) &&
      (selectedSubject.value === '' || blog.subject.description === selectedSubject.value) &&
      (selectedTypeOfLaw.value === '' || blog.typeOfLaw.description === selectedTypeOfLaw.value) &&
      matchesSearchQuery
    );
  });
});

onMounted(async () => {
  await dataStore.fetchData();
  if (dataStore.error) {
    if (dataStore.error.response) {
      errorMessage.value = `Fout: ${dataStore.error.response.status} - ${dataStore.error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }
  try {
    const blogsResponse = await axios.get('/blogs');
    blogs.value = blogsResponse.data;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Fout: ${error.response.status} - ${error.response.data.errorMessage}`;
    } else {
      errorMessage.value = 'Er is een fout opgetreden bij het laden van de gegevens.';
    }
    showErrorModal.value = true;
  }

});

function addReactie(postId) {
  const post = blogs.value.find(p => p.id === postId);
  if (newReactie.value.trim() !== '') {
    post.comments.push({ id: Date.now(), text: newReactie.value, time: new Date().toISOString() });
    newReactie.value = '';
  }
}

function closeErrorModal() {
  showErrorModal.value = false;
}
</script>

<template>
  <main>
    <div class="p-3 mb-4 border-bottom">
      <div class="container d-flex flex-wrap align-items-center justify-content-center">
        <h1 class="ms-3">Studentenrechten Blog</h1>
        <NavigationButton buttonText="Nieuw bericht" buttonLink="/new-post" />
      </div>
      <div class="container mt-3">
        <SearchInput v-model="searchQuery" />
        <div class="d-flex justify-content-between">
          <FilterSelect v-model="selectedInstitution" :options="dataStore.institutions" defaultOptionText="Instelling" />
          <FilterSelect v-model="selectedEducation" :options="dataStore.educations" defaultOptionText="Opleiding" />
          <FilterSelect v-model="selectedSubject" :options="dataStore.subjects" defaultOptionText="Onderwerp" />
          <FilterSelect v-model="selectedTypeOfLaw" :options="dataStore.typeOfLaws" defaultOptionText="Soort recht" />
        </div>
      </div>
    </div>

    <div class="container">
      <PostComponent v-for="blog in filteredBlogs" :key="blog.id" :blog="blog" @addComment="addReactie"/>
    </div>
  </main>
  <ErrorModal :showModal="showErrorModal" :errorMessage="errorMessage" @close="closeErrorModal" />
</template>

<style scoped>

</style>
