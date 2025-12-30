<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-md border border-gray-200 p-8 animate-slide-in dark:bg-white/5 dark:border-white/10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {{ isEdit ? 'Edit Blog Post' : 'Create New Blog Post' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="title" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2">
              Title
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label for="content" class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2">
              Content
            </label>
            <textarea
              id="content"
              v-model="form.content"
              required
              rows="15"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 resize-none"
              placeholder="Write your blog content here..."
            ></textarea>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
            {{ error }}
          </div>

          <div class="flex gap-6">
            <button
              type="submit"
              :disabled="loading"
              class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
            </button>
            <button
              type="button"
              @click="$router.push('/blog')"
              class="flex justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:bg-gray-700 dark:text-white dark:shadow-none dark:hover:bg-gray-600 dark:focus-visible:outline-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBlogStore } from '../stores/blog';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const blogStore = useBlogStore();

const isEdit = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  title: '',
  content: '',
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth');
    return;
  }

  if (route.name === 'blog-edit') {
    isEdit.value = true;
    const id = parseInt(route.params.id as string);
    await blogStore.fetchBlog(id);
    if (blogStore.currentBlog) {
      if (blogStore.currentBlog.authorId !== authStore.user?.id) {
        router.push('/blog');
        return;
      }
      form.title = blogStore.currentBlog.title;
      form.content = blogStore.currentBlog.content;
    }
  }
});

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  try {
    if (isEdit.value && blogStore.currentBlog) {
      await blogStore.updateBlog(blogStore.currentBlog.id, {
        title: form.title,
        content: form.content,
      });
    } else {
      await blogStore.createBlog({
        title: form.title,
        content: form.content,
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
