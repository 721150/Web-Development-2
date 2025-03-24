import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from "@/axios-auth.js";

export const useDataStore = defineStore('data', () => {
  const institutions = ref([]);
  const educations = ref([]);
  const subjects = ref([]);
  const typeOfLaws = ref([]);
  const error = ref(null);

  async function fetchData() {
    try {
      const institutionsResponse = await axios.get('/institutions');
      institutions.value = institutionsResponse.data;

      const educationsResponse = await axios.get('/educations');
      educations.value = educationsResponse.data;

      const subjectsResponse = await axios.get('/subjects');
      subjects.value = subjectsResponse.data;

      const typesOfLowsResponse = await axios.get('/typesOfLows');
      typeOfLaws.value = typesOfLowsResponse.data;

      error.value = null;
    } catch (err) {
      error.value = err;
    }
  }

  return { institutions, educations, subjects, typeOfLaws, error, fetchData };
});
