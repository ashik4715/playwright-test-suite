<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="blogStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>

      <div v-else-if="blogStore.error" class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md">
        {{ blogStore.error }}
      </div>

      <div v-else-if="blogStore.currentBlog" class="bg-white/5 rounded-md border border-white/10 p-8 animate-fade-in">
        <div class="mb-6">
          <button
            @click="$router.push('/blog')"
            class="text-indigo-400 hover:text-indigo-300 mb-4 transition-colors text-sm/6 font-semibold"
          >
            ← Back to Blog List
          </button>
          <h1 class="text-4xl font-bold text-white mb-4">
            {{ blogStore.currentBlog.title }}
          </h1>
          <div class="flex justify-between items-center text-gray-400 mb-6">
            <span>By {{ blogStore.currentBlog.author?.username || 'Unknown' }}</span>
            <span>{{ formatDate(blogStore.currentBlog.createdAt) }}</span>
          </div>
        </div>

        <div class="prose max-w-none mb-8">
          <p class="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {{ blogStore.currentBlog.content }}
          </p>
        </div>

        <div
          v-if="authStore.user && blogStore.currentBlog.authorId === authStore.user.id"
          class="flex gap-4 pt-6 border-t border-white/10"
        >
          <button
            @click="$router.push(`/blog/${blogStore.currentBlog.id}/edit`)"
            class="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 transition-all text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Edit
          </button>
          <button
            @click="handleDelete"
            class="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition-all text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
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

