import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import axios from "@/axios-auth.js";
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {

  const token = ref(localStorage.getItem('jwt') || null);
  const error = ref(null);

  const isLoggedIn = computed(() => !!token.value);

  const userId = computed(()=> {
    if (token.value) {
      const decoded = jwtDecode(token.value);
      return decoded.sub;
    }
    return null;
  });

  async function login(username, password) {
    try {
      const response = await axios.post('/users/login', {
        username: username,
        password: password
      });

      token.value = response.data;
      localStorage.setItem('jwt', token.value);

    } catch (error) {
      error.value = `Fout: ${error.message}`;
    }
  }

  function logout() {
    localStorage.removeItem('jwt');
    token.value = null;
  }

  return { token, error, login, logout, isLoggedIn, userId }
})
