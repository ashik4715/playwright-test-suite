<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-8 animate-slide-in">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          {{ isEdit ? 'Edit Blog Post' : 'Create New Blog Post' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              v-model="form.content"
              required
              rows="15"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Write your blog content here..."
            ></textarea>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
            </button>
            <button
              type="button"
              @click="$router.push('/blog')"
              class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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

