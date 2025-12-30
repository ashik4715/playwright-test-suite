<template>
  <div
    class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
        class="mx-auto h-10 w-auto dark:hidden"
        style="width: 40px; height: 40px; object-fit: contain"
      />
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        alt="Your Company"
        class="mx-auto h-10 w-auto hidden dark:block"
        style="width: 40px; height: 40px; object-fit: contain"
      />
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {{ isLogin ? "Sign in to your account" : "Create your account" }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="!isLogin">
          <label
            for="username"
            class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >Username</label
          >
          <div class="mt-2">
            <input
              id="username"
              v-model="form.username"
              type="text"
              name="username"
              required
              autocomplete="username"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              v-model="form.email"
              type="email"
              name="email"
              required
              autocomplete="email"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >Password</label
            >
          </div>
          <div class="mt-2">
            <input
              id="password"
              v-model="form.password"
              type="password"
              name="password"
              required
              :autocomplete="isLogin ? 'current-password' : 'new-password'"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
        >
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? "Processing..." : isLogin ? "Sign in" : "Sign up" }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
        {{ isLogin ? "Not a member?" : "Already have an account?" }}
        <button
          @click="toggleMode"
          type="button"
          class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          {{ isLogin ? "Start a 14 day free trial" : "Sign in" }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  username: "",
  email: "",
  password: "",
});

function toggleMode() {
  isLogin.value = !isLogin.value;
  error.value = null;
  form.username = "";
  form.email = "";
  form.password = "";
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
    router.push("/blog");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    loading.value = false;
  }
}
</script>
