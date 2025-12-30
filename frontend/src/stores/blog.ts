import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService, type Blog, type CreateBlogDto, type UpdateBlogDto } from '../services/api';

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref<Blog[]>([]);
  const currentBlog = ref<Blog | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBlogs() {
    loading.value = true;
    error.value = null;
    try {
      blogs.value = await apiService.getBlogs();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch blogs';
    } finally {
      loading.value = false;
    }
  }

  async function fetchBlog(id: number) {
    loading.value = true;
    error.value = null;
    try {
      currentBlog.value = await apiService.getBlog(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch blog';
    } finally {
      loading.value = false;
    }
  }

  async function createBlog(data: CreateBlogDto) {
    loading.value = true;
    error.value = null;
    try {
      const newBlog = await apiService.createBlog(data);
      blogs.value.unshift(newBlog);
      return newBlog;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create blog';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateBlog(id: number, data: UpdateBlogDto) {
    loading.value = true;
    error.value = null;
    try {
      const updatedBlog = await apiService.updateBlog(id, data);
      const index = blogs.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        blogs.value[index] = updatedBlog;
      }
      if (currentBlog.value?.id === id) {
        currentBlog.value = updatedBlog;
      }
      return updatedBlog;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update blog';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteBlog(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await apiService.deleteBlog(id);
      blogs.value = blogs.value.filter((b) => b.id !== id);
      if (currentBlog.value?.id === id) {
        currentBlog.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete blog';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    blogs,
    currentBlog,
    loading,
    error,
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
  };
});

