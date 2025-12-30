<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
          {{ isLogin ? 'Welcome Back' : 'Create Account' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="!isLogin" class="animate-slide-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div class="animate-slide-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div class="animate-slide-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {{ loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button
            @click="toggleMode"
            class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  username: '',
  email: '',
  password: '',
});

function toggleMode() {
  isLogin.value = !isLogin.value;
  error.value = null;
  form.username = '';
  form.email = '';
  form.password = '';
}

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  try {
    if (isLogin.value) {
      await authStore.login({
        email: form.email,
        password: form.password,
      });
    } else {
      await authStore.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
    }
    router.push('/blog');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
  } finally {
    loading.value = false;
  }
}
</script>

