<script setup>
import { ref, computed } from 'vue';
import SearchInput from '../components/SearchInput.vue';
import FilterSelect from '../components/FilterSelect.vue';
import NavigationButton from '../components/NavigationButton.vue';
import PostComponent from '../components/PostComponent.vue';

const searchQuery = ref('');
const selectedInstitution = ref('');
const selectedCourse = ref('');
const selectedTopic = ref('');
const selectedRightType = ref('');
const newComment = ref('');

const institutions = ['Instelling A', 'Instelling B', 'Instelling C'];
const courses = ['Opleiding X', 'Opleiding Y', 'Opleiding Z'];
const topics = ['Onderwerp 1', 'Onderwerp 2', 'Onderwerp 3'];
const rightTypes = ['Recht A', 'Recht B', 'Recht C'];

const posts = ref([
  {
    id: 1,
    title: 'Vraag over examencommissie',
    content: 'Hoe kan ik bezwaar maken tegen een beslissing van de examencommissie?',
    institution: 'Instelling A',
    course: 'Opleiding X',
    topic: 'Onderwerp 1',
    rightType: 'Recht A',
    comments: [
      { id: 1, author: 'Student 1', text: 'Je kunt een verzoekschrift indienen.' },
      { id: 2, author: 'Student 2', text: 'Raadpleeg het Studentenstatuut.' }
    ],
    showComments: false
  },
]);

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    return (
      (selectedInstitution.value === '' || post.institution === selectedInstitution.value) &&
      (selectedCourse.value === '' || post.course === selectedCourse.value) &&
      (selectedTopic.value === '' || post.topic === selectedTopic.value) &&
      (selectedRightType.value === '' || post.rightType === selectedRightType.value) &&
      (searchQuery.value === '' || post.title.includes(searchQuery.value) || post.content.includes(searchQuery.value))
    );
  });
});

function toggleComments(postId) {
  const post = posts.value.find(p => p.id === postId);
  post.showComments = !post.showComments;
}

function addComment(postId) {
  const post = posts.value.find(p => p.id === postId);
  if (newComment.value.trim() !== '') {
    post.comments.push({ id: Date.now(), author: 'Anonieme Student', text: newComment.value });
    newComment.value = '';
  }
}

function createNewPost() {
  // Logica voor het maken van een nieuwe post
  console.log('Nieuwe post maken');
}
</script>

<template>
  <main>
    <div class="p-3 mb-4 border-bottom">
      <div class="container d-flex flex-wrap align-items-center justify-content-center">
        <h1 class="ms-3">Studentenrechten Blog</h1>
        <NavigationButton buttonText="Nieuw bericht" buttonLink="/new-post" @navigate="createNewPost" />
      </div>
      <div class="container mt-3">
        <SearchInput v-model="searchQuery" />
        <div class="d-flex justify-content-between">
          <FilterSelect v-model="selectedInstitution" :options="institutions" defaultOptionText="Instelling" />
          <FilterSelect v-model="selectedCourse" :options="courses" defaultOptionText="Opleiding" />
          <FilterSelect v-model="selectedTopic" :options="topics" defaultOptionText="Onderwerp" />
          <FilterSelect v-model="selectedRightType" :options="rightTypes" defaultOptionText="Soort recht" />
        </div>
      </div>
    </div>

    <div class="container">
      <PostComponent v-for="post in filteredPosts" :key="post.id" :post="post" @addComment="addComment"/>
    </div>
  </main>
</template>

<style scoped>

</style>
