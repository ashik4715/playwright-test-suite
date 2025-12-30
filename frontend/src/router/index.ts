import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/blog',
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/blog',
      name: 'blog-list',
      component: () => import('../views/BlogListView.vue'),
    },
    {
      path: '/blog/create',
      name: 'blog-create',
      component: () => import('../views/BlogFormView.vue'),
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
    },
    {
      path: '/blog/:id/edit',
      name: 'blog-edit',
      component: () => import('../views/BlogFormView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.path !== '/auth' && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.path === '/auth' && authStore.isAuthenticated) {
    next('/blog')
  } else {
    next()
  }
})

export default router
