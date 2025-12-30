<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="blogStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-500"></div>
      </div>

      <div v-else-if="blogStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
        {{ blogStore.error }}
      </div>

      <div v-else-if="blogStore.currentBlog" class="bg-white rounded-md border border-gray-200 p-8 animate-fade-in dark:bg-white/5 dark:border-white/10">
        <div class="mb-6">
          <button
            @click="$router.push('/blog')"
            class="text-indigo-600 hover:text-indigo-500 mb-4 transition-colors text-sm/6 font-semibold dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Back to Blog List
          </button>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ blogStore.currentBlog.title }}
          </h1>
          <div class="flex justify-between items-center text-gray-600 dark:text-gray-400 mb-6">
            <span>By {{ blogStore.currentBlog.author?.username || 'Unknown' }}</span>
            <span>{{ formatDate(blogStore.currentBlog.createdAt) }}</span>
          </div>
        </div>

        <div class="prose max-w-none mb-8">
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {{ blogStore.currentBlog.content }}
          </p>
        </div>

        <div
          v-if="authStore.user && blogStore.currentBlog.authorId === authStore.user.id"
          class="flex gap-6 pt-6 border-t border-gray-200 dark:border-white/10"
        >
          <button
            @click="$router.push(`/blog/${blogStore.currentBlog.id}/edit`)"
            class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 transition-colors"
          >
            Edit
          </button>
          <button
            @click="handleDelete"
            class="flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400 dark:focus-visible:outline-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBlogStore } from '../stores/blog';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const blogStore = useBlogStore();

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth');
    return;
  }
  const id = parseInt(route.params.id as string);
  await blogStore.fetchBlog(id);
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function handleDelete() {
  if (!blogStore.currentBlog) return;
  if (confirm('Are you sure you want to delete this blog post?')) {
    try {
      await blogStore.deleteBlog(blogStore.currentBlog.id);
      router.push('/blog');
    } catch (error) {
      // Error is handled by the store
    }
  }
}
</script>
