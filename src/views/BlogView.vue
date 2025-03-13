<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/axios-auth.js';
import SearchInput from '../components/SearchInput.vue';
import FilterSelect from '../components/FilterSelect.vue';
import NavigationButton from '../components/NavigationButton.vue';
import PostComponent from '../components/PostComponent.vue';

const searchQuery = ref('');
const selectedInstitution = ref('');
const selectedEducation = ref('');
const selectedSubject = ref('');
const selectedTypeOfLaw = ref('');
const newComment = ref('');

const institutions = ref([]);
const educations = ref([]);
const subjects = ref([]);
const typeOfLow = ref([]);
const blogs = ref([]);

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
  try {
    const institutionsResponse = await axios.get('/institutions');
    institutions.value = institutionsResponse.data;

    const educationsResponse = await axios.get('/educations');
    educations.value = educationsResponse.data;

    const subjectsResponse = await axios.get('/subjects');
    subjects.value = subjectsResponse.data;

    const typesOfLowsResponse = await axios.get('/typesOfLows');
    typeOfLow.value = typesOfLowsResponse.data;

    const blogsResponse = await axios.get('/blogs');
    blogs.value = blogsResponse.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

function toggleComments(postId) {
  const post = blogs.value.find(p => p.id === postId);
  post.showComments = !post.showComments;
}

function addComment(postId) {
  const post = blogs.value.find(p => p.id === postId);
  if (newComment.value.trim() !== '') {
    post.comments.push({ id: Date.now(), text: newComment.value, time: new Date().toISOString() });
    newComment.value = '';
  }
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
          <FilterSelect v-model="selectedInstitution" :options="institutions" defaultOptionText="Instelling" />
          <FilterSelect v-model="selectedEducation" :options="educations" defaultOptionText="Opleiding" />
          <FilterSelect v-model="selectedSubject" :options="subjects" defaultOptionText="Onderwerp" />
          <FilterSelect v-model="selectedTypeOfLaw" :options="typeOfLow" defaultOptionText="Soort recht" />
        </div>
      </div>
    </div>

    <div class="container">
      <PostComponent v-for="blog in filteredBlogs" :key="blog.id" :blog="blog" @addComment="addComment"/>
    </div>
  </main>
</template>

<style scoped>

</style>
