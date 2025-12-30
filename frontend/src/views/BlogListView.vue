<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8 animate-fade-in">
        <h1 class="text-4xl font-bold text-white">Blog Posts</h1>
        <div class="flex gap-4 items-center">
          <span v-if="authStore.user" class="text-gray-300">
            Welcome, {{ authStore.user.username }}!
          </span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm/6 font-semibold"
          >
            Logout
          </button>
          <button
            @click="$router.push('/blog/create')"
            class="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 transition-all text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            + New Post
          </button>
        </div>
      </div>

      <div v-if="blogStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>

      <div v-else-if="blogStore.error" class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md mb-6">
        {{ blogStore.error }}
      </div>

      <div v-else-if="blogStore.blogs.length === 0" class="text-center py-12">
        <p class="text-gray-400 text-lg">No blog posts yet. Create your first post!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(blog, index) in blogStore.blogs"
          :key="blog.id"
          class="bg-white/5 rounded-md border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-white mb-2 line-clamp-2">
              {{ blog.title }}
            </h2>
            <p class="text-gray-400 text-sm mb-4 line-clamp-3">
              {{ blog.content }}
            </p>
            <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>By {{ blog.author?.username || 'Unknown' }}</span>
              <span>{{ formatDate(blog.createdAt) }}</span>
            </div>
            <button
              @click="$router.push(`/blog/${blog.id}`)"
              class="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-400 transition-colors text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBlogStore } from '../stores/blog';

const router = useRouter();
const authStore = useAuthStore();
const blogStore = useBlogStore();

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth');
    return;
  }
  await blogStore.fetchBlogs();
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function handleLogout() {
  authStore.logout();
  router.push('/auth');
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

