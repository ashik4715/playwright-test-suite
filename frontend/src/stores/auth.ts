import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService, type LoginDto, type RegisterDto } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<{ id: number; username: string; email: string } | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(authToken: string, userData: { id: number; username: string; email: string }) {
    token.value = authToken;
    user.value = userData;
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function login(credentials: LoginDto) {
    try {
      const response = await apiService.login(credentials);
      setAuth(response.access_token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function register(data: RegisterDto) {
    try {
      const response = await apiService.register(data);
      setAuth(response.access_token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    clearAuth();
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});

