<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8 animate-fade-in">
        <h1 class="text-4xl font-bold text-gray-900">Blog Posts</h1>
        <div class="flex gap-4 items-center">
          <span v-if="authStore.user" class="text-gray-700">
            Welcome, {{ authStore.user.username }}!
          </span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
          <button
            @click="$router.push('/blog/create')"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            + New Post
          </button>
        </div>
      </div>

      <div v-if="blogStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="blogStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ blogStore.error }}
      </div>

      <div v-else-if="blogStore.blogs.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No blog posts yet. Create your first post!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(blog, index) in blogStore.blogs"
          :key="blog.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ blog.title }}
            </h2>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ blog.content }}
            </p>
            <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>By {{ blog.author?.username || 'Unknown' }}</span>
              <span>{{ formatDate(blog.createdAt) }}</span>
            </div>
            <button
              @click="$router.push(`/blog/${blog.id}`)"
              class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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

